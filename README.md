# chip8-wasm

A Chip 8 Emulator in Webassembly.

### Build
Ensure you have wasm-pack installed.

In / (root) directory, execute 
```bash
wasm-pack build
```
In /www directory, execute
```bash
npm install
```

### Run

A webpack-dev-server will constantly run inside /www directory
```bash
npm run start
```

After any change to rust files, run from / (root), in a separate terminal session
```bash
wasm-pack build
```
and the dev-server will automatically reload
