import { Chip } from '@pkg/chip8/chip8_wasm';

export const textureDesc: GPUTextureDescriptor = {
    size: {
        width: Chip.vram_width(),
        height: Chip.vram_height(),
        depthOrArrayLayers: 1,
    },
    format: 'r8unorm',
    usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.TEXTURE_BINDING,
};

export const textureBindGroupLayoutDesc: GPUBindGroupLayoutDescriptor = {
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
};

export const samplerDesc: GPUSamplerDescriptor = {
    addressModeU: 'repeat',
    addressModeV: 'repeat',
    magFilter: 'nearest',
    minFilter: 'nearest',
};

/*
// Example

// prettier-ignore
const textureData = new Uint8Array([
     20,  48,  77, 105,
    134, 162, 191, 220,
]);
const texture = device.createTexture({
    size: { width: 4, height: 2, depthOrArrayLayers: 1 },
    format: 'r8unorm',
    usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.TEXTURE_BINDING,
});
device.queue.writeTexture(
    { texture },
    textureData,
    { offset: 0, bytesPerRow: 4 },
    { width: 4, height: 2 },
);
*/

/*
// Example for image

const response = await fetch(
    new URL('/assets/img/moon.jpg', import.meta.url).toString(),
);
const imgBitmap = await createImageBitmap(await response.blob());

const texture = device.createTexture({
    size: [imgBitmap.width, imgBitmap.height],
    format: 'rgba8unorm',
    usage:
        GPUTextureUsage.TEXTURE_BINDING |
        GPUTextureUsage.COPY_DST |
        GPUTextureUsage.RENDER_ATTACHMENT,
});

device.queue.copyExternalImageToTexture(
    { source: imgBitmap, flipY: true },
    { texture: texture },
    { width: imgBitmap.width, height: imgBitmap.height },
);
 */
