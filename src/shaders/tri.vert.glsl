#version 300 es

in vec2 aVertCoord;
in vec2 aTexCoord;
out vec2 vTexCoord;

void main() {
    gl_Position = vec4(aVertCoord, 0, 1);
    vTexCoord = aTexCoord;
}
