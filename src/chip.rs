use wasm_bindgen::{prelude::wasm_bindgen, JsValue};
use web_sys::CanvasRenderingContext2d;

use crate::display::Display;
use crate::utils::set_panic_hook;

#[allow(dead_code)]
#[wasm_bindgen]
pub struct Chip {
    mem: [u8; 4096],
    reg: [u8; 16],
    idx: u16,
    pub pc: u16,
    sp: u8,
    stack: [u16; 16],
    delay_timer: u8,
    sound_timer: u8,

    vram: [u8; 64 * 32],
    vram_change: bool,
    display: Display,

    keys: [bool; 16],
    key_waiting: bool,
    key_register: u16,
}

#[wasm_bindgen]
pub struct OutputChange {
    pub vram: bool,
    pub beep: bool
}

const FONT_SET: [u8; 80] = [
    0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
    0x20, 0x60, 0x20, 0x20, 0x70, // 1
    0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
    0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
    0x90, 0x90, 0xF0, 0x10, 0x10, // 4
    0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
    0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
    0xF0, 0x10, 0x20, 0x40, 0x40, // 7
    0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
    0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
    0xF0, 0x90, 0xF0, 0x90, 0x90, // A
    0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
    0xF0, 0x80, 0x80, 0x80, 0xF0, // C
    0xE0, 0x90, 0x90, 0x90, 0xE0, // D
    0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
    0xF0, 0x80, 0xF0, 0x80, 0x80, // F
];

enum PC {
    Next,
    Skip,
    Jump(u16),
}

impl PC {
    fn skip_if(cond: bool) -> PC {
        if cond {
            PC::Skip
        } else {
            PC::Next
        }
    }
}

#[wasm_bindgen]
impl Chip {
    pub fn new(canvas: CanvasRenderingContext2d) -> Self {
        set_panic_hook();

        let mut mem = [0_u8; 4096];
        for i in 0x050..0x09f {
            mem[i] = FONT_SET[i - 0x050];
        }

        Chip {
            mem,
            reg: [0; 16],
            idx: 0,
            pc: 0x200,
            sp: 0,
            stack: [0; 16],
            delay_timer: 0,
            sound_timer: 0,

            vram: [0; 64 * 32],
            vram_change: false,
            display: Display::new(canvas),

            keys: [false; 16],
            key_waiting: false,
            key_register: 0,
        }
    }

    pub fn load(mut self, rom: &[u8]) -> Self {
        for (offset, &byte) in rom.iter().enumerate() {
            let addr = 0x200 + offset;
            if addr < 4096 {
                self.mem[addr] = byte;
            } else {
                break;
            }
        }
        self
    }

    pub fn draw(&mut self) -> Result<(), JsValue> {
        self.display.draw(&self.vram)?;
        Ok(())
    }

    pub fn tick(&mut self) -> OutputChange {
        self.vram_change = false;

        if self.key_waiting {
            for i in 0..self.keys.len() {
                if self.keys[i] {
                    self.key_waiting = false;
                    self.reg[self.key_register as usize] = i as u8;
                    break;
                }
            }
        } else {
            if self.delay_timer > 0 {
                self.delay_timer -= 1;
            }
            if self.sound_timer > 0 {
                self.sound_timer -= 1;
            }

            let opcode = (self.mem[self.pc as usize] as u16) << 8
                | (self.mem[(self.pc + 1) as usize] as u16);

            let pc_state = self.execute(opcode);

            match pc_state {
                PC::Next => self.pc += 2,
                PC::Skip => self.pc += 4,
                PC::Jump(addr) => self.pc = addr,
            };
        }

        OutputChange {
            vram: self.vram_change,
            beep: self.sound_timer > 0,
        }
    }

    pub fn set_key(&mut self, key: u8) {
        if key < 16 {
            self.keys[key as usize] = true;
        }
    }

    pub fn unset_key(&mut self, key: u8) {
        if key < 16 {
            self.keys[key as usize] = false;
        }
    }

    fn execute(&mut self, opcode: u16) -> PC {
        let nibbles = (
            ((opcode & 0xf000) >> 12) as u8,
            ((opcode & 0x0f00) >> 8) as u8,
            ((opcode & 0x00f0) >> 4) as u8,
            (opcode & 0x000f) as u8,
        );

        let nnn = opcode & 0x0fff;
        let kk = (opcode & 0x00ff) as u8;

        let (_, x, y, n) = nibbles;


        match (nibbles.0, x, y, n) {
            (0x00, 0x00, 0x0e, 0x00) => self.op_00e0(),
            (0x00, 0x00, 0x0e, 0x0e) => self.op_00ee(),
            (0x01, _, _, _) => PC::Jump(nnn),
            (0x02, _, _, _) => self.op_2nnn(nnn),
            (0x03, _, _, _) => PC::skip_if(self.reg[x as usize] == kk),
            (0x04, _, _, _) => PC::skip_if(self.reg[x as usize] != kk),
            (0x05, _, _, 0x00) => PC::skip_if(self.reg[x as usize] == self.reg[y as usize]),
            (0x06, _, _, _) => self.op_6xkk(x, kk),
            (0x07, _, _, _) => self.op_7xkk(x, kk),
            (0x08, _, _, 0x00) => self.op_8xy0(x, y),
            (0x08, _, _, 0x01) => self.op_8xy1(x, y),
            (0x08, _, _, 0x02) => self.op_8xy2(x, y),
            (0x08, _, _, 0x03) => self.op_8xy3(x, y),
            (0x08, _, _, 0x04) => self.op_8xy4(x, y),
            (0x08, _, _, 0x05) => self.op_8xy5(x, y),
            (0x08, _, _, 0x06) => self.op_8xy6(x),
            (0x08, _, _, 0x07) => self.op_8xy7(x, y),
            (0x08, _, _, 0x0e) => self.op_8xye(x),
            (0x09, _, _, 0x00) => PC::skip_if(self.reg[x as usize] != self.reg[y as usize]),
            (0x0a, _, _, _) => self.op_annn(nnn),
            (0x0b, _, _, _) => PC::Jump(nnn + self.reg[0] as u16),
            (0x0c, _, _, _) => self.op_cxkk(x, kk),
            (0x0d, _, _, _) => self.op_dxyn(x, y, n),
            (0x0e, _, 0x09, 0x0e) => PC::skip_if(self.keys[self.reg[x as usize] as usize]),
            (0x0e, _, 0x0a, 0x01) => PC::skip_if(!self.keys[self.reg[x as usize] as usize]),
            (0x0f, _, 0x00, 0x07) => self.op_fx07(x),
            (0x0f, _, 0x00, 0x0a) => self.op_fx0a(x),
            (0x0f, _, 0x01, 0x05) => self.op_fx15(x),
            (0x0f, _, 0x01, 0x08) => self.op_fx18(x),
            (0x0f, _, 0x01, 0x0e) => self.op_fx1e(x),
            (0x0f, _, 0x02, 0x09) => self.op_fx29(x),
            (0x0f, _, 0x03, 0x03) => self.op_fx33(x),
            (0x0f, _, 0x05, 0x05) => self.op_fx55(x),
            (0x0f, _, 0x06, 0x05) => self.op_fx65(x),
            _ => PC::Next,
        }
    }

    fn op_00e0(&mut self) -> PC {
        self.vram.fill(0);
        self.vram_change = true;
        PC::Next
    }

    fn op_00ee(&mut self) -> PC {
        self.sp -= 1;
        PC::Jump(self.stack[self.sp as usize])
    }

    fn op_2nnn(&mut self, nnn: u16) -> PC {
        self.stack[self.sp as usize] = self.pc + 2;
        self.sp += 1;
        PC::Jump(nnn)
    }

    fn op_6xkk(&mut self, x: u8, kk: u8) -> PC {
        self.reg[x as usize] = kk;
        PC::Next
    }

    fn op_7xkk(&mut self, x: u8, kk: u8) -> PC {
        self.reg[x as usize] += kk;
        PC::Next
    }

    fn op_8xy0(&mut self, x: u8, y: u8) -> PC {
        self.reg[x as usize] = self.reg[y as usize];
        PC::Next
    }

    fn op_8xy1(&mut self, x: u8, y: u8) -> PC {
        self.reg[x as usize] |= self.reg[y as usize];
        PC::Next
    }

    fn op_8xy2(&mut self, x: u8, y: u8) -> PC {
        self.reg[x as usize] &= self.reg[y as usize];
        PC::Next
    }

    fn op_8xy3(&mut self, x: u8, y: u8) -> PC {
        self.reg[x as usize] ^= self.reg[y as usize];
        PC::Next
    }

    fn op_8xy4(&mut self, x: u8, y: u8) -> PC {
        let (x, y) = (x as usize, y as usize);

        let vx = self.reg[x] as u16;
        let vy = self.reg[y] as u16;
        let result = vx + vy;
        self.reg[x] = result as u8;
        self.reg[0x0f] = if result > 0xFF { 1 } else { 0 };
        PC::Next
    }

    fn op_8xy5(&mut self, x: u8, y: u8) -> PC {
        let (x, y) = (x as usize, y as usize);

        self.reg[0x0f] = if self.reg[x] > self.reg[y] { 1 } else { 0 };
        self.reg[x] = self.reg[x].wrapping_sub(self.reg[y]);
        PC::Next
    }

    fn op_8xy6(&mut self, x: u8) -> PC {
        let x = x as usize;

        self.reg[0x0f] = self.reg[x] & 1;
        self.reg[x] >>= 1;
        PC::Next
    }

    fn op_8xy7(&mut self, x: u8, y: u8) -> PC {
        let (x, y) = (x as usize, y as usize);

        self.reg[0x0f] = if self.reg[y] > self.reg[x] { 1 } else { 0 };
        self.reg[x] = self.reg[y].wrapping_sub(self.reg[x]);
        PC::Next
    }

    fn op_8xye(&mut self, x: u8) -> PC {
        let x = x as usize;

        self.reg[0x0f] = (self.reg[x] & 0b_1000_0000) >> 7;
        self.reg[x] <<= 1;
        PC::Next
    }

    fn op_annn(&mut self, nnn: u16) -> PC {
        self.idx = nnn;
        PC::Next
    }

    fn op_cxkk(&mut self, x: u8, kk: u8) -> PC {
        let mut buff = [0_u8];

        match getrandom::getrandom(&mut buff) {
            Err(_) => buff[0] = 0,
            _ => (),
        };

        self.reg[x as usize] = buff[0] & kk;
        PC::Next
    }

    fn op_dxyn(&mut self, x: u8, y: u8, n: u8) -> PC {
        self.reg[0x0f] = 0;

        let x = (self.reg[x as usize] % 64) as usize;

        for row in 0..n {
            let y = (self.reg[y as usize] % 32 + row) as usize;

            if y >= 32 {
                break;
            }

            let sprite = self.mem[self.idx as usize + row as usize];

            let bits = [
                (sprite & 0b_1000_0000) >> 7,
                (sprite & 0b_0100_0000) >> 6,
                (sprite & 0b_0010_0000) >> 5,
                (sprite & 0b_0001_0000) >> 4,
                (sprite & 0b_0000_1000) >> 3,
                (sprite & 0b_0000_0100) >> 2,
                (sprite & 0b_0000_0010) >> 1,
                (sprite & 0b_0000_0001),
            ];

            for (sprite_x, &bit) in bits.iter().enumerate() {
                if x + sprite_x >= 64 {
                    break;
                }

                let screen_pixel = self.vram[y * 64 + (x + sprite_x)];

                if bit != 0 {
                    if screen_pixel == 0 {
                        self.vram[y * 64 + (x + sprite_x)] = 1;
                    } else {
                        self.vram[y * 64 + (x + sprite_x)] = 0;
                        self.reg[0x0f] = 1;
                    }
                }
            }
        }

        self.vram_change = true;
        PC::Next
    }

    fn op_fx07(&mut self, x: u8) -> PC {
        self.reg[x as usize] = self.delay_timer;
        PC::Next
    }

    fn op_fx0a(&mut self, x: u8) -> PC {
        self.key_waiting = true;
        self.key_register = x as u16;
        PC::Next
    }

    fn op_fx15(&mut self, x: u8) -> PC {
        self.delay_timer = self.reg[x as usize];
        PC::Next
    }

    fn op_fx18(&mut self, x: u8) -> PC {
        self.sound_timer = self.reg[x as usize];
        PC::Next
    }

    fn op_fx1e(&mut self, x: u8) -> PC {
        self.idx += self.reg[x as usize] as u16;
        PC::Next
    }

    fn op_fx29(&mut self, x: u8) -> PC {
        self.idx = self.reg[x as usize] as u16 * 5 + 0x050;
        PC::Next
    }

    fn op_fx33(&mut self, x: u8) -> PC {
        let num = self.reg[x as usize];

        self.mem[self.idx as usize] = num / 100;
        self.mem[self.idx as usize + 1] = (num % 100) / 10;
        self.mem[self.idx as usize + 2] = num % 10;

        PC::Next
    }

    fn op_fx55(&mut self, x: u8) -> PC {
        let x = x as usize;

        for i in 0..=x {
            self.mem[self.idx as usize + i] = self.reg[i];
        }

        PC::Next
    }

    fn op_fx65(&mut self, x: u8) -> PC {
        let x = x as usize;

        for i in 0..=x {
            self.reg[i] = self.mem[self.idx as usize + i];
        }

        PC::Next
    }
}
