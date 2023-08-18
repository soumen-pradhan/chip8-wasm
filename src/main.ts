import './style.css';

import { log, throwError } from './utils';

import { Chip } from '@pkg/chip8';
import { memory } from '@pkg/chip8/chip8_wasm_bg.wasm';

import { roms, keys } from './info';
import { webgpuRender } from './webgpu';
import { webglRender } from './webgl';

const canvas: HTMLCanvasElement = document.querySelector('#chip-display')!;
{
    // Set width and height of canvas according to 2:1
    const aspectRatio = 2;
    const devicePixelRatio = window.devicePixelRatio ?? 1;
    canvas.width = canvas.clientWidth * devicePixelRatio;
    canvas.height = (canvas.clientWidth / aspectRatio) * devicePixelRatio;

    log(`Canvas: ${canvas.width} x ${canvas.height}`);
}

/** Create Chip and load default ROM */

const data = await fetch(roms.get('Chip8 Pic')!);
const array = await data.arrayBuffer();
const buff = new Uint8Array(array);

const chip = Chip.new();
chip.load(buff);

const [chip_wt, chip_ht] = [Chip.vram_width(), Chip.vram_height()];

// live reload, since it's a reference
const textureData = new Uint8Array(
    memory.buffer,
    chip.vram_ptr(),
    chip_wt * chip_ht,
);

/** Interactivity */

// Possible Bug: Race condition for chip access

const keyOg: HTMLDivElement = document.querySelector('#key-og')!;

const keyOgChild: NodeListOf<HTMLDivElement> =
    document.querySelectorAll('#key-og .key');
const keyMapChild: NodeListOf<HTMLDivElement> =
    document.querySelectorAll('#key-map .key');

function addKeyHandlers(chip: Chip) {
    document.addEventListener('keydown', (event) => {
        event.preventDefault(); // prevent changing the select menu options

        if (keys.has(event.key)) {
            const [mappedKey, idxKey] = keys.get(event.key)!;

            chip.set_key(mappedKey);

            keyOgChild[idxKey].classList.add('invert');
            keyMapChild[idxKey].classList.add('invert');
        }
    });

    document.addEventListener('keyup', (event) => {
        event.preventDefault(); // prevent changing the select menu options

        if (keys.has(event.key)) {
            const [mappedKey, idxKey] = keys.get(event.key)!;

            chip.unset_key(mappedKey);

            keyOgChild[idxKey].classList.remove('invert');
            keyMapChild[idxKey].classList.remove('invert');
        }
    });
}

function addTouchHandlers() {
    keyOg.addEventListener('pointerdown', (event) => {
        event.preventDefault();

        const key = (event.target as HTMLSpanElement).dataset.key;
        if (!key) return;

        if (keys.has(key)) {
            const [mappedKey, idxKey] = keys.get(key)!;

            chip.set_key(mappedKey);

            keyOgChild[idxKey].classList.add('invert');
            keyMapChild[idxKey].classList.add('invert');
        }
    });

    keyOg.addEventListener('pointerup', (event) => {
        event.preventDefault();

        const key = (event.target as HTMLSpanElement).dataset.key;
        if (!key) return;

        if (keys.has(key)) {
            const [mappedKey, idxKey] = keys.get(key)!;

            chip.unset_key(mappedKey);

            keyOgChild[idxKey].classList.remove('invert');
            keyMapChild[idxKey].classList.remove('invert');
        }
    });
}

addKeyHandlers(chip);
addTouchHandlers();

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

async function main() {
    try {
        const device =
            (await (await navigator.gpu?.requestAdapter())?.requestDevice()) ??
            null;

        if (device) {
            log('Rendering using WebGPU');
            webgpuRender(canvas, device, chip, textureData);
        } else if (window.WebGL2RenderingContext) {
            log('Falling back to WebGL');
            webglRender(canvas, chip, textureData);
        } else {
            throwError('No Renderer available');
        }
    } catch (e) {
        console.error(`${e}`);

        const app: HTMLDivElement = document.querySelector('#app')!;
        const errElem = document.createElement('div');
        errElem.classList.add('error');
        errElem.textContent = `${e}`;
        app.appendChild(errElem);
    }
}

main();
