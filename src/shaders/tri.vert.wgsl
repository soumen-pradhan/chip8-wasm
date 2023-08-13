struct VSOut {
    @builtin(position) pos: vec4f,
    // @location(0) color: vec3f,
    @location(0) uv: vec2f,
};

struct UBO {
  mvp: mat4x4<f32>,
  primaryColor: vec4f,
  accentColor: vec4f
};

@group(0) @binding(0)
var<uniform> uniforms: UBO;

@vertex
fn main(
    @location(0) in_pos: vec2f,
    @location(1) in_color: vec3f,
    @location(2) in_uv: vec2f,
) -> VSOut {
    var vs_out: VSOut;

    vs_out.pos = uniforms.mvp * vec4f(in_pos, 0.0, 1.0);
    // vs_out.color = in_color;
    vs_out.uv = in_uv;

    return vs_out;
}
