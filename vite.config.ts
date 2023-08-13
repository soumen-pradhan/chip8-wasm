import { Plugin, defineConfig } from 'vite';
import wasm from 'vite-plugin-wasm';

import path from 'path';
import { spawnSync } from 'child_process';
import fs from 'fs';

import chalk from 'chalk';

const log = console.log;

type WasmCompileArgs = {
    flags: Iterable<string>;
};

function wasmCompile(args: WasmCompileArgs = { flags: [] }): Plugin {
    const isProd = () => process.env.NODE_ENV === 'production';

    function compileRustCrates() {
        const cratesPath = path.resolve(__dirname, './crates');

        const crates = fs.readdirSync(cratesPath).filter((it) => {
            const item = path.resolve(cratesPath, it);
            return fs.lstatSync(item).isDirectory();
        });

        log(chalk.yellow(`Found crates [${crates.join(', ')}]`));

        for (const crate of crates) {
            log();

            const cratePath = path.resolve(cratesPath, crate);
            const pkgPath = path.resolve(__dirname, `./pkg/${crate}`);

            log(chalk.yellow(`Compiling ${crate}`));

            const buildResult = spawnSync(
                'wasm-pack',
                [
                    '--log-level',
                    'warn',
                    'build',
                    cratePath,
                    isProd() ? '--release' : '--dev',
                    '--out-dir',
                    pkgPath,
                    '--',
                    ...args.flags,
                ],
                { stdio: 'inherit' },
            );

            if (buildResult.error || buildResult.status !== 0) {
                log(chalk.red(`Failed to compile ${crate}`));
            }
        }

        log();
    }

    return {
        name: 'wasm-compile',
        enforce: 'pre',

        configureServer(server) {
            server.watcher.add(path.resolve(__dirname, './crates/**/src/*.rs'));

            server.watcher.on('change', (file) => {
                if (file.endsWith('.rs') || file.endsWith('Cargo.toml')) {
                    compileRustCrates();
                }
            });
        },

        buildStart(_params) {
            compileRustCrates();
        },
    };
}

export default defineConfig({
    resolve: {
        alias: {
            '@pkg': path.resolve(__dirname, './pkg'),
        },
    },
    plugins: [wasmCompile({ flags: ['--features', 'wee_alloc'] }), wasm()],
    build: {
        target: 'esnext',
        outDir: 'docs',
    },
    base: '/chip8-wasm/'
});
