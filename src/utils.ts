export const log = console.log;

export const err = (str: string) => {
    throw new Error(str);
};

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const randu8 = (max: number = 256) => Math.floor(Math.random() * max);
