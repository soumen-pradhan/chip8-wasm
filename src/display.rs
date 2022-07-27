use wasm_bindgen::{prelude::*, Clamped};
use web_sys::{CanvasRenderingContext2d, ImageData};

pub struct Display {
    buffer: Vec<u8>,
    canvas: CanvasRenderingContext2d,
}

impl Display {
    pub fn new(canvas: CanvasRenderingContext2d) -> Self {
        Display {
            buffer: vec![0; (64 * 10) * (32 * 10) * 4],
            canvas,
        }
    }

    pub fn draw(&mut self, data: &[u8]) -> Result<(), JsValue> {
        nearest_interpolation(data, &mut self.buffer, 10);
        let image =
            ImageData::new_with_u8_clamped_array_and_sh(Clamped(&self.buffer), 64 * 10, 32 * 10)?;
        self.canvas.put_image_data(&image, 0_f64, 0_f64)?;

        Ok(())
    }
}

fn nearest_interpolation(data: &[u8], display: &mut [u8], scale: u32) {
    for x in 0..32 * scale {
        for y in 0..64 * scale {
            let px = x / scale;
            let py = y / scale;

            let pixel = data[(px * 64 + py) as usize];
            let pixel = if pixel == 0 { 0 } else { 255 };

            let idx = (x * 64 * scale * 4 + y * 4) as usize;
            display[idx + 0] = pixel;
            display[idx + 1] = pixel;
            display[idx + 2] = pixel;
            display[idx + 3] = 255;
        }
    }
}
