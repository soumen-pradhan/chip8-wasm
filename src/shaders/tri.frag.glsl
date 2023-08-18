#version 300 es

precision highp float;

// if you don't use some var, compiler might remove it.
uniform sampler2D uTexture;
uniform vec4 uPrimaryColor;
uniform vec4 uAccentColor;

in vec2 vTexCoord;
out vec4 fragColor;

void main() {
    vec4 sampled = texture(uTexture, vTexCoord) * 255.0;
    fragColor = mix(uPrimaryColor , uAccentColor, sampled.r);
}
