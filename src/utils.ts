export const log = console.log;

export const throwError = (str: string) => {
    throw new Error(str);
};

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const randu8 = (max: number = 256) => Math.floor(Math.random() * max);

export const writeCanvas = (context: CanvasRenderingContext2D, msg: string) => {
    context.font = '36px monospace';
    context.fillStyle = 'red';
    context.fillText(msg, 50, 50);
};
