import { sleep, throwError } from './utils';

import vertShaderCode from './shaders/tri.vert.glsl?raw';
import fragShaderCode from './shaders/tri.frag.glsl?raw';

import { indices, uniformData, vertices } from './meshes/rect';
import { Chip } from '@pkg/chip8/chip8_wasm';
import { beep } from './info';

type shaderType =
    | WebGL2RenderingContext['VERTEX_SHADER']
    | WebGL2RenderingContext['FRAGMENT_SHADER'];

function createShader(
    gl: WebGL2RenderingContext,
    type: shaderType,
    source: string,
) {
    const shader = gl.createShader(type);
    if (!shader) return null;

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    const status = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (status) return shader;

    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
}

function createProgram(
    gl: WebGL2RenderingContext,
    vertexShader: WebGLShader,
    fragShader: WebGLShader,
) {
    const program = gl.createProgram();
    if (!program) return null;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) return program;

    console.error(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
}

export function webglRender(
    canvas: HTMLCanvasElement,
    chip: Chip,
    textureData: Uint8Array,
) {
    /** Create Program. Compile Shaders. */

    const gl = canvas.getContext('webgl2') ?? throwError('No webgl context');

    const vertexShader =
        createShader(gl, gl.VERTEX_SHADER, vertShaderCode) ??
        throwError('Vertex shader not compiled');

    const fragShader =
        createShader(gl, gl.FRAGMENT_SHADER, fragShaderCode) ??
        throwError('Fragment shader not compiled');

    const program =
        createProgram(gl, vertexShader, fragShader) ??
        throwError('No Gl Program');

    /** The Rectangle buffers */

    const vertexBuffer = gl.createBuffer() ?? throwError('No vertexBuffer');
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer() ?? throwError('No vertexBuffer');
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    // description of vertex/index buffer layout
    const vertCoordsAttribLoc = gl.getAttribLocation(program, 'aVertCoord');
    gl.enableVertexAttribArray(vertCoordsAttribLoc);
    const texCoordsAttribLoc = gl.getAttribLocation(program, 'aTexCoord');
    gl.enableVertexAttribArray(texCoordsAttribLoc);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    gl.vertexAttribPointer(
        vertCoordsAttribLoc,
        2,
        gl.FLOAT,
        false,
        4 * 4,
        0 * 4,
    );

    gl.vertexAttribPointer(
        texCoordsAttribLoc,
        2,
        gl.FLOAT,
        false,
        4 * 4,
        2 * 4,
    );

    /** Create the texture, later data in bind in render loop */

    const texture = gl.createTexture() ?? throwError('No texture');
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.useProgram(program);

    /** Bind uniforms */

    const texUniformLoc =
        gl.getUniformLocation(program, 'uTexture') ??
        throwError("No uniform called 'uTexture'");

    gl.uniform1i(texUniformLoc, 0);

    const primColorUniformLoc =
        gl.getUniformLocation(program, 'uPrimaryColor') ??
        throwError("No uniform called 'uPrimaryColor'");

    const accentColorUniformLoc =
        gl.getUniformLocation(program, 'uAccentColor') ??
        throwError("No uniform called 'uAccentColor'");

    gl.uniform4fv(primColorUniformLoc, uniformData, 4 * 4, 4);
    gl.uniform4fv(accentColorUniformLoc, uniformData, 5 * 4, 4);

    gl.viewport(0, 0, canvas.width, canvas.height);

    /** Render Loop */

    async function render(_now: DOMHighResTimeStamp) {
        while (chip.next()) {
            const output = chip.tick();
            if (output.beep) beep.play();
            if (output.vram) break;
            await sleep(0.05);
        }

        gl.clearColor(0, 0, 0, 0.2);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.R8,
            Chip.vram_width(),
            Chip.vram_height(),
            0,
            gl.RED,
            gl.UNSIGNED_BYTE,
            textureData,
        );

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}
