
const canvas = document.getElementById("chip-display");

const SCALE = 10;
canvas.width = 64 * SCALE;
canvas.height = 32 * SCALE;

const context = canvas.getContext("2d");

console.log("Start from web");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function test_sleep(n) {
    for (let i = 0; i <= n; i++) {
        await sleep(i * 1000);
        console.log(`waiting for ${i} sec`);
    }
}

test_sleep(3);
