use wasm_bindgen::{prelude::*, Clamped};
use web_sys::{CanvasRenderingContext2d, ImageData};

pub struct Display {
    buffer: Vec<u8>,
    canvas: CanvasRenderingContext2d,
    scale: u32,
}

impl Display {
    pub fn new(canvas: CanvasRenderingContext2d, scale: u32) -> Self {
        Display {
            buffer: vec![0; (64 * scale as usize) * (32 * scale as usize) * 4],
            canvas,
            scale,
        }
    }

    pub fn draw(&mut self, data: &[u8]) -> Result<(), JsValue> {
        nearest_interpolation(data, &mut self.buffer, self.scale);

        let image = ImageData::new_with_u8_clamped_array_and_sh(
            Clamped(&self.buffer),
            64 * self.scale,
            32 * self.scale,
        )?;

        self.canvas.put_image_data(&image, 0_f64, 0_f64)?;

        Ok(())
    }
}

fn nearest_interpolation(data: &[u8], display: &mut [u8], scale: u32) {
    for y in 0..(32 * scale) {
        for x in 0..(64 * scale) {
            let px = x / scale;
            let py = y / scale;

            let pixel = data[(py * 64 + px) as usize];
            let (r, g, b) = if pixel == 0 {
                (47, 47, 47)
            } else {
                (220, 220, 220)
            };

            let idx = (y * 64 * scale * 4 + x * 4) as usize;
            display[idx + 0] = r;
            display[idx + 1] = g;
            display[idx + 2] = b;
            display[idx + 3] = 255;
        }
    }
}
