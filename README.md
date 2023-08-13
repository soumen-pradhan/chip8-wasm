# chip8-wasm

A Chip 8 Emulator in Webassembly. Renderer in WebGPU.

Demo: [soumen-pradhan.github.io/chip8-wasm](https://soumen-pradhan.github.io/chip8-wasm/)

## How does it work ?

The core logic of Chip-8 spec is implemented in Rust, compiled to WASM (WebAssembly). The compiled WASM module exposes its `display ram` and `set_key` functions.

The exposed Display ram is then used as a texture for our `canvas` element. This allows us to use the WebGPU API and efficiently scale and draw the display.

This decouples the emulator logic and render logic.

## Building and Running

Ensure you have wasm-pack installed.

Tested on

| Tool      | Version |
| --------- | ------- |
| chrome    | 115     |
| node      | 18.16.0 |
| npm       | 9.5.1   |
| cargo     | 1.71.0  |
| wasm-pack | 0.12.1  |

### Dev Mode (Live Reload)

```bash
npm run dev
```

Caution:

-   The first time you run `npm run dev`, a resolve error will be dislayed (related to esbuild), however the packages will be served correctly. This will not happen for subsequent builds or production build.
-   You can add multiple rust crates, but `vite` will compile all of them regardless of which crate you modified.

### Build for production

```bash
npm run build
```

## Resources

#### Chip-8
-   [Tobias' Guide](https://tobiasvl.github.io/blog/write-a-chip-8-emulator)
-   [Cowgod's Chip-8 Reference](http://devernay.free.fr/hacks/chip8/C8TECH10.HTM)
-   [Rust impl using SDL](https://github.com/starrhorne/chip8-rust)

#### WebGPU
- [WebGPU samples in next.js](https://webgpu.github.io/webgpu-samples/)
- [Raw WebGPU](https://alain.xyz/blog/raw-webgpu)
- [Introduction to WebGPU (YouTube)](https://youtu.be/Hm2_bH_8j3k)
- [WebGPU spec](https://www.w3.org/TR/webgpu) | [WGSL spec](https://www.w3.org/TR/WGSL)

#### ROMS

-   [aquova](https://github.com/aquova/chip8-book/tree/master/roms)
-   [loktar00](https://github.com/loktar00/chip8/tree/master/roms)
-   [mattmikolay](https://github.com/mattmikolay/chip-8)
