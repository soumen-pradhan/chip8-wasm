import { err } from './utils';

export default async function setGpu(
    context: GPUCanvasContext,
): Promise<[GPUDevice, GPUTextureFormat]> {
    const gpu = navigator.gpu ?? err('WebGPU not supported on this browser');

    const device =
        (await (await gpu.requestAdapter())?.requestDevice()) ??
        err('A GPU device could not be obtained');

    const canvasFormat = gpu.getPreferredCanvasFormat();

    context.configure({
        device,
        format: canvasFormat,
        alphaMode: 'premultiplied',
    });

    return [device, canvasFormat];
}
