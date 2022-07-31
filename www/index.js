import { Chip } from "chip8-wasm";
import { roms, keys, beepWav } from "./assets.json";

// Setting up Canvas

const canvas = document.getElementById("chip-display");

const SCALE = 10;
canvas.width = 64 * SCALE;
canvas.height = 32 * SCALE;

const context = canvas.getContext("2d");

// Helper functions and data

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const romFiles = new Map(roms);
const keyMap = new Map(keys);
const beep = new Audio(beepWav);

function addKeyHandlers(chip) {
    document.addEventListener("keydown", (event) => {
        if (keyMap.has(event.key)) {
            chip.set_key(keyMap.get(event.key));
        }
    });

    document.addEventListener("keyup", (event) => {
        if (keyMap.has(event.key)) {
            chip.unset_key(keyMap.get(event.key));
        }
    });
}

// Chip running

let chip;

async function run() {
    const data = await fetch(`roms/loktar00/IBM Logo.ch8`);
    const array = await data.arrayBuffer();
    const buff = new Uint8ClampedArray(array);

    chip = Chip.new(context).load(buff);
    addKeyHandlers(chip);

    console.log("Chip loaded");

    chip.draw();

    while (chip.pc <= 0xfff) {
        const output = chip.tick();

        if (output.vram) chip.draw();
        if (output.beep) beep.play();

        await sleep(0.25);
    }

    console.log("End of Mem");
}

// Dropdown Menu

const selectRom = document.getElementById("roms");

selectRom.addEventListener("change", async (event) => {
    const rom = romFiles.has(selectRom.value)
        ? romFiles.get(selectRom.value)
        : "roms/loktar00/IBM Logo.ch8";

    const data = await fetch(rom);

    const array = await data.arrayBuffer();
    const buff = new Uint8ClampedArray(array);

    chip = Chip.new(context).load(buff);
    addKeyHandlers(chip);
});

for (let [value, _] of romFiles) {
    const opt = document.createElement("option");
    opt.value = value;
    opt.textContent = value;

    selectRom.appendChild(opt);
}

// main Loop

run();
