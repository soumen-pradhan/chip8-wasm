/**
 * 0 - 3
 * |   |
 * 1 - 2
 */

/**
 * For the given 2x2 texture:
 *
 * Red  Green
 * Blue Black
 *
 * (0, 0) -> samples Red.
 * (1, 1) -> samples Black
 * (0.5, 0.5) -> samples Black
 * (0, 1) -> samples Green
 */

// prettier-ignore
export const vertices = new Float32Array([
    // position, tex coords
    -0.99,  0.99, 0.0, 0.0,  // Top-left vertex
    -0.99, -0.99, 0.0, 1.0,  // Bottom-left vertex
     0.99, -0.99, 1.0, 1.0,  // Bottom-right vertex
     0.99,  0.99, 1.0, 0.0,  // Top-right vertex
]);

export const vertexBufferDesc: GPUVertexBufferLayout = {
    attributes: [
        {
            shaderLocation: 0, // @location(0)
            offset: 0,
            format: 'float32x2',
        },
        {
            shaderLocation: 2, // @location(2)
            offset: 4 * 2,
            format: 'float32x2',
        },
    ],
    arrayStride: 4 * 4, // sizeof(f32) * 2
    stepMode: 'vertex',
};

// currently not used.
// prettier-ignore
export const colors = new Float32Array([
    1.0, 0.0, 0.0, // red
    0.0, 1.0, 0.0, // green
    0.0, 0.0, 1.0, // blue
    1.0, 1.0, 0.0, // yellow
]);

export const colorBufferDesc: GPUVertexBufferLayout = {
    attributes: [
        {
            shaderLocation: 1, // @location(1)
            offset: 0,
            format: 'float32x3',
        },
    ],
    arrayStride: 4 * 3, // sizeof(f32) * 3
    stepMode: 'vertex',
};

export const indices = new Uint16Array([0, 1, 2, 0, 2, 3]);

// prettier-ignore
export const uniformData = new Float32Array([
    // ♟️ ModelViewProjection Matrix (Identity)
    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0,

    // Primary Color
    0.19, 0.19, 0.19, 1.0,

    // Accent Color
    0.87, 0.87, 0.87, 1.0,
]);
