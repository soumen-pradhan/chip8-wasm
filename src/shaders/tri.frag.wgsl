@group(1) @binding(1)
var texSampler: sampler;

@group(1) @binding(2)
var tex: texture_2d<f32>;

struct UBO {
  mvp: mat4x4<f32>,
  primaryColor: vec4f,
  accentColor: vec4f
};

@group(0) @binding(0)
var<uniform> uniforms: UBO;

@fragment
fn main(
    // @location(0) frag_color: vec3f,
    @location(0) uv: vec2f
) -> @location(0) vec4f {
    var texColor = textureSample(tex, texSampler, uv) * 255;

    let outputColor = mix(
        uniforms.primaryColor,
        uniforms.accentColor,
        texColor.r
    );

    // return vec4f(texColor * 200, 1.0);
    // return vec4f(texColor.rrg, 1.0);
    return vec4f(outputColor.rgb, 1.0);
}
