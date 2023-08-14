import './style.css';

import { throwError, log, sleep, writeCanvas } from './utils';

import vertShaderCode from './shaders/tri.vert.wgsl?raw';
import fragShaderCode from './shaders/tri.frag.wgsl?raw';

import { Chip } from '@pkg/chip8';
import { memory } from '@pkg/chip8/chip8_wasm_bg.wasm';

import {
    colorBufferDesc,
    colors,
    indices,
    uniformData,
    vertexBufferDesc,
    vertices,
} from './meshes/rect';

import { roms, keys, beep } from './info';

const canvas: HTMLCanvasElement = document.querySelector('#chip-display')!;
{
    // Set width and height of canvas according to 2:1
    const aspectRatio = 2;
    const devicePixelRatio = window.devicePixelRatio ?? 1;
    canvas.width = canvas.clientWidth * devicePixelRatio;
    canvas.height = (canvas.clientWidth / aspectRatio) * devicePixelRatio;

    log(`canvas: ${canvas.width} x ${canvas.height}`);
}

/** Create Chip and load default ROM */

const data = await fetch(roms.get('Chip8 Pic')!);
const array = await data.arrayBuffer();
const buff = new Uint8Array(array);

const chip = Chip.new();
chip.load(buff);

/** Interactivity */

// Possible Bug: Race condition for chip access

const keyOg: NodeListOf<HTMLElement> =
    document.querySelectorAll('#key-og span.key')!;

const keyMap: NodeListOf<HTMLElement> =
    document.querySelectorAll('#key-map span.key')!;

function addKeyHandlers(chip: Chip) {
    document.addEventListener('keydown', (event) => {
        if (keys.has(event.key)) {
            const [mappedKey, idxKey] = keys.get(event.key)!;

            chip.set_key(mappedKey);

            keyOg[idxKey].style.filter = 'invert(90%)';
            keyMap[idxKey].style.filter = 'invert(90%)';
        }
    });

    document.addEventListener('keyup', (event) => {
        if (keys.has(event.key)) {
            const [mappedKey, idxKey] = keys.get(event.key)!;

            chip.unset_key(mappedKey);

            keyOg[idxKey].style.filter = 'none';
            keyMap[idxKey].style.filter = 'none';
        }
    });
}

addKeyHandlers(chip);

/** DropDown Menu (from info.ts) */

const selectRom: HTMLSelectElement = document.querySelector('#roms')!;

selectRom.addEventListener('change', async (_event) => {
    const rom = roms.get(selectRom.value)!;

    const data = await (await fetch(rom)).arrayBuffer();
    const buff = new Uint8Array(data);

    chip.load(buff);
});

for (let [value, _] of roms) {
    const opt = document.createElement('option');
    opt.value = value;
    opt.textContent = value;

    selectRom.appendChild(opt);
}

/** Render Logic */

try {
    /** Check and set up device */
    const gpu = navigator.gpu ?? throwError('WebGPU is not supported');
    const device =
        (await (await gpu.requestAdapter())?.requestDevice()) ??
        throwError('No device found');

    const canvasFormat = gpu.getPreferredCanvasFormat();

    const context =
        canvas.getContext('webgpu') ??
        throwError('No webgpu context for the canvas');
    {
        context.configure({
            device,
            format: canvasFormat,
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC,
            alphaMode: 'opaque',
        });
    }

    const depthTexture = device.createTexture({
        size: [canvas.width, canvas.height, 1],
        dimension: '2d',
        format: 'depth24plus-stencil8',
        usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC,
    });

    /** The Rectangle buffers and uniform */

    function createBuffer(arr: Float32Array | Uint16Array, usage: number) {
        const buffer = device.createBuffer({
            size: (arr.byteLength + 3) & ~3, // for alignment
            usage,
            mappedAtCreation: true,
        });

        const writeArray =
            arr instanceof Float32Array
                ? new Float32Array(buffer.getMappedRange())
                : new Uint16Array(buffer.getMappedRange());

        writeArray.set(arr);
        buffer.unmap();

        return buffer;
    }

    const vertexBuffer = createBuffer(vertices, GPUBufferUsage.VERTEX);
    const colorBuffer = createBuffer(colors, GPUBufferUsage.VERTEX);
    const indexBuffer = createBuffer(indices, GPUBufferUsage.INDEX);

    const uniformBuffer = createBuffer(
        uniformData,
        GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    );
    const uniformBindGroupLayout = device.createBindGroupLayout({
        entries: [
            {
                binding: 0,
                visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                buffer: {},
            },
        ],
    });
    const uniformBindGroup = device.createBindGroup({
        layout: uniformBindGroupLayout,
        entries: [
            {
                binding: 0,
                resource: { buffer: uniformBuffer },
            },
        ],
    });

    /** Map memory and create the texture, sampler  */

    const [chip_wt, chip_ht] = [Chip.vram_width(), Chip.vram_height()];

    // live reload, since it's a reference
    const textureData = new Uint8Array(
        memory.buffer,
        chip.vram_ptr(),
        chip_wt * chip_ht,
    );

    const texture = device.createTexture({
        size: {
            width: Chip.vram_width(),
            height: Chip.vram_height(),
            depthOrArrayLayers: 1,
        },
        format: 'r8unorm',
        usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.TEXTURE_BINDING,
    });

    const sampler = device.createSampler({
        addressModeU: 'repeat',
        addressModeV: 'repeat',
        magFilter: 'nearest',
        minFilter: 'nearest',
    });

    const textureBindGroupLayout = device.createBindGroupLayout({
        entries: [
            {
                binding: 1,
                visibility: GPUShaderStage.FRAGMENT,
                sampler: { type: 'filtering' },
            },
            {
                binding: 2,
                visibility: GPUShaderStage.FRAGMENT,
                texture: { sampleType: 'float' },
            },
        ],
    });

    const textureBindGroup = device.createBindGroup({
        layout: textureBindGroupLayout,
        entries: [
            {
                binding: 1,
                resource: sampler,
            },
            {
                binding: 2,
                resource: texture.createView(),
            },
        ],
    });

    /** The GPU Pipeline */

    const pipeline = device.createRenderPipeline({
        layout: device.createPipelineLayout({
            bindGroupLayouts: [uniformBindGroupLayout, textureBindGroupLayout], // @group(0), @group(1)
        }),

        vertex: {
            module: device.createShaderModule({ code: vertShaderCode }),
            entryPoint: 'main',
            buffers: [vertexBufferDesc, colorBufferDesc],
        },

        fragment: {
            module: device.createShaderModule({ code: fragShaderCode }),
            entryPoint: 'main',
            targets: [{ format: canvasFormat }],
        },

        primitive: {
            cullMode: 'none',
            frontFace: 'cw',
            topology: 'triangle-list',
        },

        depthStencil: {
            depthWriteEnabled: true,
            depthCompare: 'less',
            format: 'depth24plus-stencil8',
        },
    });

    /** Render loop */

    async function render(_now: DOMHighResTimeStamp) {
        while (chip.next()) {
            const output = chip.tick();
            if (output.beep) beep.play();
            if (output.vram) break;
            await sleep(0.05);
        }

        device.queue.writeTexture(
            { texture },
            textureData,
            { offset: 0, bytesPerRow: chip_wt },
            { width: chip_wt, height: chip_ht },
        );

        const colorTextureView = context.getCurrentTexture().createView();

        const colorAttachment: GPURenderPassColorAttachment = {
            view: colorTextureView,
            clearValue: { r: 0, g: 0, b: 0, a: 1 },
            loadOp: 'clear',
            storeOp: 'store',
        };

        const cmdEncoder = device.createCommandEncoder();
        const passEncoder = cmdEncoder.beginRenderPass({
            colorAttachments: [colorAttachment],
            depthStencilAttachment: {
                view: depthTexture.createView(),
                depthClearValue: 1,
                depthLoadOp: 'clear',
                depthStoreOp: 'store',
                stencilClearValue: 0,
                stencilLoadOp: 'clear',
                stencilStoreOp: 'store',
            },
        });

        {
            passEncoder.setPipeline(pipeline);
            passEncoder.setViewport(0, 0, canvas.width, canvas.height, 0, 1);
            passEncoder.setScissorRect(0, 0, canvas.width, canvas.height);

            // pipeline.layout.bindGroupLayouts
            passEncoder.setBindGroup(0, uniformBindGroup);
            passEncoder.setBindGroup(1, textureBindGroup);

            // pipeline.vertex.buffers
            passEncoder.setVertexBuffer(0, vertexBuffer);
            passEncoder.setVertexBuffer(1, colorBuffer);

            passEncoder.setIndexBuffer(indexBuffer, 'uint16');
            passEncoder.drawIndexed(6);
        }

        passEncoder.end();
        device.queue.submit([cmdEncoder.finish()]);

        requestAnimationFrame(render);
    }

    /** Start render loop */

    requestAnimationFrame(render);
} catch (e) {
    const context = canvas.getContext('2d')!;
    writeCanvas(context, `${e}`);
}
