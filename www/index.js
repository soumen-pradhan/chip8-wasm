import { Chip } from "chip8-wasm";

const canvas = document.getElementById("chip-display");

const SCALE = 10;
canvas.width = 64 * SCALE;
canvas.height = 32 * SCALE;

const context = canvas.getContext("2d");

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function run() {
    const data = await fetch(`roms/TEST_IMG`);
    const array = await data.arrayBuffer();
    const buff = new Uint8ClampedArray(array);

    const chip = Chip.new(context).load(buff);
    console.log("Chip loaded");

    chip.draw();
    
    let it = 0
    while (chip.pc <= 0x500 && it <= 256) {
        let redraw = chip.tick();
        
        if (redraw) {
            chip.draw();
        }
        
        await sleep(2);
        it++;
    }

    console.log("End of memory");
}

run();

