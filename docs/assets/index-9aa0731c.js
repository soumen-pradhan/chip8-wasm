(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const i of o)if(i.type==="childList")for(const _ of i.addedNodes)_.tagName==="LINK"&&_.rel==="modulepreload"&&r(_)}).observe(document,{childList:!0,subtree:!0});function n(o){const i={};return o.integrity&&(i.integrity=o.integrity),o.referrerPolicy&&(i.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?i.credentials="include":o.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function r(o){if(o.ep)return;o.ep=!0;const i=n(o);fetch(o.href,i)}})();const E=console.log,d=e=>{throw new Error(e)},X=e=>new Promise(t=>setTimeout(t,e)),se=(e,t)=>{e.font="36px monospace",e.fillStyle="red",e.fillText(t,50,50)},_e="/chip8-wasm/assets/chip8_wasm_bg-214a2669.wasm",ue=async(e={},t)=>{let n;if(t.startsWith("data:")){const r=t.replace(/^data:.*?base64,/,"");let o;if(typeof Buffer=="function"&&typeof Buffer.from=="function")o=Buffer.from(r,"base64");else if(typeof atob=="function"){const i=atob(r);o=new Uint8Array(i.length);for(let _=0;_<i.length;_++)o[_]=i.charCodeAt(_)}else throw new Error("Cannot decode base64-encoded data URL");n=await WebAssembly.instantiate(o,e)}else{const r=await fetch(t),o=r.headers.get("Content-Type")||"";if("instantiateStreaming"in WebAssembly&&o.startsWith("application/wasm"))n=await WebAssembly.instantiateStreaming(r,e);else{const i=await r.arrayBuffer();n=await WebAssembly.instantiate(i,e)}}return n.instance.exports};let s;function de(e){s=e}const g=new Array(128).fill(void 0);g.push(void 0,null,!0,!1);function a(e){return g[e]}let x=g.length;function Ae(e){e<132||(g[e]=x,x=e)}function J(e){const t=a(e);return Ae(e),t}const fe=typeof TextDecoder>"u"?(0,module.require)("util").TextDecoder:TextDecoder;let $=new fe("utf-8",{ignoreBOM:!0,fatal:!0});$.decode();let B=null;function ee(){return(B===null||B.byteLength===0)&&(B=new Uint8Array(s.memory.buffer)),B}function W(e,t){return e=e>>>0,$.decode(ee().subarray(e,e+t))}function c(e){x===g.length&&g.push(g.length+1);const t=x;return x=g[t],g[t]=e,t}let te=0;function le(e,t){const n=t(e.length*1,1)>>>0;return ee().set(e,n/1),te=e.length,n}function m(e,t){try{return e.apply(this,t)}catch(n){s.__wbindgen_exn_store(c(n))}}class A{static __wrap(t){t=t>>>0;const n=Object.create(A.prototype);return n.__wbg_ptr=t,n}__destroy_into_raw(){const t=this.__wbg_ptr;return this.__wbg_ptr=0,t}free(){const t=this.__destroy_into_raw();s.__wbg_chip_free(t)}static new(){const t=s.chip_new();return A.__wrap(t)}static vram_width(){return s.chip_vram_width()>>>0}static vram_height(){return s.chip_vram_height()>>>0}vram_ptr(){return s.chip_vram_ptr(this.__wbg_ptr)}load(t){const n=le(t,s.__wbindgen_malloc),r=te;s.chip_load(this.__wbg_ptr,n,r)}next(){return s.chip_next(this.__wbg_ptr)!==0}tick(){const t=s.chip_tick(this.__wbg_ptr);return O.__wrap(t)}set_key(t){s.chip_set_key(this.__wbg_ptr,t)}unset_key(t){s.chip_unset_key(this.__wbg_ptr,t)}}class O{static __wrap(t){t=t>>>0;const n=Object.create(O.prototype);return n.__wbg_ptr=t,n}__destroy_into_raw(){const t=this.__wbg_ptr;return this.__wbg_ptr=0,t}free(){const t=this.__destroy_into_raw();s.__wbg_outputchange_free(t)}get vram(){return s.__wbg_get_outputchange_vram(this.__wbg_ptr)!==0}set vram(t){s.__wbg_set_outputchange_vram(this.__wbg_ptr,t)}get beep(){return s.__wbg_get_outputchange_beep(this.__wbg_ptr)!==0}set beep(t){s.__wbg_set_outputchange_beep(this.__wbg_ptr,t)}}function ge(e){J(e)}function me(e){const t=a(e).crypto;return c(t)}function pe(e){const t=a(e);return typeof t=="object"&&t!==null}function we(e){const t=a(e).process;return c(t)}function be(e){const t=a(e).versions;return c(t)}function he(e){const t=a(e).node;return c(t)}function ye(e){return typeof a(e)=="string"}function ve(){return m(function(){const e=module.require;return c(e)},arguments)}function xe(e,t){const n=W(e,t);return c(n)}function Ee(e){const t=a(e).msCrypto;return c(t)}function Ue(){return m(function(e,t){a(e).getRandomValues(a(t))},arguments)}function Re(){return m(function(e,t){a(e).randomFillSync(J(t))},arguments)}function Te(e){return typeof a(e)=="function"}function Se(e,t){const n=new Function(W(e,t));return c(n)}function Ce(){return m(function(e,t){const n=a(e).call(a(t));return c(n)},arguments)}function Be(){return m(function(){const e=self.self;return c(e)},arguments)}function Le(){return m(function(){const e=window.window;return c(e)},arguments)}function ke(){return m(function(){const e=globalThis.globalThis;return c(e)},arguments)}function Pe(){return m(function(){const e=global.global;return c(e)},arguments)}function De(e){return a(e)===void 0}function Ge(){return m(function(e,t,n){const r=a(e).call(a(t),a(n));return c(r)},arguments)}function Ie(e){const t=a(e).buffer;return c(t)}function Fe(e,t,n){const r=new Uint8Array(a(e),t>>>0,n>>>0);return c(r)}function Me(e){const t=new Uint8Array(a(e));return c(t)}function Qe(e,t,n){a(e).set(a(t),n>>>0)}function Ne(e){const t=new Uint8Array(e>>>0);return c(t)}function We(e,t,n){const r=a(e).subarray(t>>>0,n>>>0);return c(r)}function Oe(e){const t=a(e);return c(t)}function Ve(e,t){throw new Error(W(e,t))}function Ke(){const e=s.memory;return c(e)}URL=globalThis.URL;const u=await ue({"./chip8_wasm_bg.js":{__wbindgen_object_drop_ref:ge,__wbg_crypto_c48a774b022d20ac:me,__wbindgen_is_object:pe,__wbg_process_298734cf255a885d:we,__wbg_versions_e2e78e134e3e5d01:be,__wbg_node_1cd7a5d853dbea79:he,__wbindgen_is_string:ye,__wbg_require_8f08ceecec0f4fee:ve,__wbindgen_string_new:xe,__wbg_msCrypto_bcb970640f50a1e8:Ee,__wbg_getRandomValues_37fa2ca9e4e07fab:Ue,__wbg_randomFillSync_dc1e9a60c158336d:Re,__wbindgen_is_function:Te,__wbg_newnoargs_581967eacc0e2604:Se,__wbg_call_cb65541d95d71282:Ce,__wbg_self_1ff1d729e9aae938:Be,__wbg_window_5f4faef6c12b79ec:Le,__wbg_globalThis_1d39714405582d3c:ke,__wbg_global_651f05c6a0944d1c:Pe,__wbindgen_is_undefined:De,__wbg_call_01734de55d61e11d:Ge,__wbg_buffer_085ec1f694018c4f:Ie,__wbg_newwithbyteoffsetandlength_6da8e527659b86aa:Fe,__wbg_new_8125e318e6245eed:Me,__wbg_set_5cf90238115182c3:Qe,__wbg_newwithlength_e5d69174d6984cd7:Ne,__wbg_subarray_13db269f57aa838d:We,__wbindgen_object_clone_ref:Oe,__wbindgen_throw:Ve,__wbindgen_memory:Ke}},_e),re=u.memory,qe=u.__wbg_chip_free,Ze=u.__wbg_outputchange_free,Ye=u.__wbg_get_outputchange_vram,je=u.__wbg_set_outputchange_vram,ze=u.__wbg_get_outputchange_beep,He=u.__wbg_set_outputchange_beep,Xe=u.chip_new,Je=u.chip_vram_ptr,$e=u.chip_load,et=u.chip_next,tt=u.chip_tick,rt=u.chip_set_key,nt=u.chip_unset_key,ot=u.chip_vram_width,at=u.chip_vram_height,it=u.__wbindgen_malloc,ct=u.__wbindgen_exn_store,st=Object.freeze(Object.defineProperty({__proto__:null,__wbg_chip_free:qe,__wbg_get_outputchange_beep:ze,__wbg_get_outputchange_vram:Ye,__wbg_outputchange_free:Ze,__wbg_set_outputchange_beep:He,__wbg_set_outputchange_vram:je,__wbindgen_exn_store:ct,__wbindgen_malloc:it,chip_load:$e,chip_new:Xe,chip_next:et,chip_set_key:rt,chip_tick:tt,chip_unset_key:nt,chip_vram_height:at,chip_vram_ptr:Je,chip_vram_width:ot,memory:re},Symbol.toStringTag,{value:"Module"}));de(st);const V=new Map([["Chip8 Pic","roms/loktar00/Chip8 Picture.ch8"],["IBM Logo","roms/loktar00/IBM Logo.ch8"],["Brix","roms/loktar00/Brix [Andreas Gustafsson, 1990].ch8"],["Particles","roms/loktar00/Particle Demo [zeroZshadow, 2008].ch8"],["Zero","roms/loktar00/Zero Demo [zeroZshadow, 2007].ch8"],["Keypad","roms/loktar00/Keypad Test [Hap, 2006].ch8"],["Maze","roms/loktar00/Maze [David Winter, 199x].ch8"],["Trip8","roms/loktar00/Trip8 Demo (2008) [Revival Studios].ch8"],["Heart Beat","roms/mattmikolay/heartmonitor/heart_monitor.ch8"],["Morse Code","roms/mattmikolay/morsecode/morse_demo.ch8"],["Random","roms/mattmikolay/randomnumber/random_number_test.ch8"],["WipeOff","roms/aquova/WIPEOFF"],["Test Image","roms/aquova/TEST_IMG"]]),p=new Map([["1",[1,0]],["2",[2,1]],["3",[3,2]],["4",[12,3]],["q",[4,4]],["w",[5,5]],["e",[6,6]],["r",[13,7]],["a",[7,8]],["s",[8,9]],["d",[9,10]],["f",[14,11]],["z",[10,12]],["x",[0,13]],["c",[11,14]],["v",[15,15]]]),ne=new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU="),oe=new Float32Array([-.99,.99,0,0,-.99,-.99,0,1,.99,-.99,1,1,.99,.99,1,0]),_t={attributes:[{shaderLocation:0,offset:0,format:"float32x2"},{shaderLocation:2,offset:4*2,format:"float32x2"}],arrayStride:4*4,stepMode:"vertex"},ut=new Float32Array([1,0,0,0,1,0,0,0,1,1,1,0]),dt={attributes:[{shaderLocation:1,offset:0,format:"float32x3"}],arrayStride:4*3,stepMode:"vertex"},F=new Uint16Array([0,1,2,0,2,3]),M=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,.19,.19,.19,1,.87,.87,.87,1]),At=`struct VSOut {
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
`,ft=`@group(1) @binding(1)
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
`;async function lt(e,t,n){const r=navigator.gpu??d("WebGPU is not supported"),o=await(await r.requestAdapter())?.requestDevice()??d("No GPU device found"),i=r.getPreferredCanvasFormat(),_=e.getContext("webgpu")??d("No WebGPU context for the canvas");_.configure({device:o,format:i,usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.COPY_SRC,alphaMode:"opaque"});const U=o.createTexture({size:[e.width,e.height,1],dimension:"2d",format:"depth24plus-stencil8",usage:GPUTextureUsage.RENDER_ATTACHMENT|GPUTextureUsage.COPY_SRC});function b(C,Y){const h=o.createBuffer({size:C.byteLength+3&-4,usage:Y,mappedAtCreation:!0});return(C instanceof Float32Array?new Float32Array(h.getMappedRange()):new Uint16Array(h.getMappedRange())).set(C),h.unmap(),h}const R=b(oe,GPUBufferUsage.VERTEX),T=b(ut,GPUBufferUsage.VERTEX),P=b(F,GPUBufferUsage.INDEX),D=b(M,GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST),S=o.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.VERTEX|GPUShaderStage.FRAGMENT,buffer:{}}]}),G=o.createBindGroup({layout:S,entries:[{binding:0,resource:{buffer:D}}]}),[y,K]=[A.vram_width(),A.vram_height()],v=o.createTexture({size:{width:A.vram_width(),height:A.vram_height(),depthOrArrayLayers:1},format:"r8unorm",usage:GPUTextureUsage.COPY_DST|GPUTextureUsage.TEXTURE_BINDING}),ae=o.createSampler({addressModeU:"repeat",addressModeV:"repeat",magFilter:"nearest",minFilter:"nearest"}),q=o.createBindGroupLayout({entries:[{binding:1,visibility:GPUShaderStage.FRAGMENT,sampler:{type:"filtering"}},{binding:2,visibility:GPUShaderStage.FRAGMENT,texture:{sampleType:"float"}}]}),ie=o.createBindGroup({layout:q,entries:[{binding:1,resource:ae},{binding:2,resource:v.createView()}]}),ce=o.createRenderPipeline({layout:o.createPipelineLayout({bindGroupLayouts:[S,q]}),vertex:{module:o.createShaderModule({code:At}),entryPoint:"main",buffers:[_t,dt]},fragment:{module:o.createShaderModule({code:ft}),entryPoint:"main",targets:[{format:i}]},primitive:{cullMode:"none",frontFace:"cw",topology:"triangle-list"},depthStencil:{depthWriteEnabled:!0,depthCompare:"less",format:"depth24plus-stencil8"}});async function Z(C){for(;t.next();){const j=t.tick();if(j.beep&&ne.play(),j.vram)break;await X(.05)}o.queue.writeTexture({texture:v},n,{offset:0,bytesPerRow:y},{width:y,height:K});const h={view:_.getCurrentTexture().createView(),clearValue:{r:0,g:0,b:0,a:1},loadOp:"clear",storeOp:"store"},I=o.createCommandEncoder(),f=I.beginRenderPass({colorAttachments:[h],depthStencilAttachment:{view:U.createView(),depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store",stencilClearValue:0,stencilLoadOp:"clear",stencilStoreOp:"store"}});f.setPipeline(ce),f.setViewport(0,0,e.width,e.height,0,1),f.setScissorRect(0,0,e.width,e.height),f.setBindGroup(0,G),f.setBindGroup(1,ie),f.setVertexBuffer(0,R),f.setVertexBuffer(1,T),f.setIndexBuffer(P,"uint16"),f.drawIndexed(6),f.end(),o.queue.submit([I.finish()]),requestAnimationFrame(Z)}requestAnimationFrame(Z)}const gt=`#version 300 es

in vec2 aVertCoord;
in vec2 aTexCoord;
out vec2 vTexCoord;

void main() {
    gl_Position = vec4(aVertCoord, 0, 1);
    vTexCoord = aTexCoord;
}
`,mt=`#version 300 es

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
`;function z(e,t,n){const r=e.createShader(t);return r?(e.shaderSource(r,n),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(console.error(e.getShaderInfoLog(r)),e.deleteShader(r),null)):null}function pt(e,t,n){const r=e.createProgram();return r?(e.attachShader(r,t),e.attachShader(r,n),e.linkProgram(r),e.getProgramParameter(r,e.LINK_STATUS)?r:(console.error(e.getProgramInfoLog(r)),e.deleteProgram(r),null)):null}function wt(e,t,n){const r=e.getContext("webgl2")??d("No webgl context"),o=z(r,r.VERTEX_SHADER,gt)??d("Vertex shader not compiled"),i=z(r,r.FRAGMENT_SHADER,mt)??d("Fragment shader not compiled"),_=pt(r,o,i)??d("No Gl Program"),U=r.createBuffer()??d("No vertexBuffer");r.bindBuffer(r.ARRAY_BUFFER,U),r.bufferData(r.ARRAY_BUFFER,oe,r.STATIC_DRAW);const b=r.createBuffer()??d("No vertexBuffer");r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,b),r.bufferData(r.ELEMENT_ARRAY_BUFFER,F,r.STATIC_DRAW);const R=r.getAttribLocation(_,"aVertCoord");r.enableVertexAttribArray(R);const T=r.getAttribLocation(_,"aTexCoord");r.enableVertexAttribArray(T),r.bindBuffer(r.ARRAY_BUFFER,U),r.vertexAttribPointer(R,2,r.FLOAT,!1,4*4,0*4),r.vertexAttribPointer(T,2,r.FLOAT,!1,4*4,2*4);const P=r.createTexture()??d("No texture");r.bindTexture(r.TEXTURE_2D,P),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MAG_FILTER,r.NEAREST),r.useProgram(_);const D=r.getUniformLocation(_,"uTexture")??d("No uniform called 'uTexture'");r.uniform1i(D,0);const S=r.getUniformLocation(_,"uPrimaryColor")??d("No uniform called 'uPrimaryColor'"),G=r.getUniformLocation(_,"uAccentColor")??d("No uniform called 'uAccentColor'");r.uniform4fv(S,M,4*4,4),r.uniform4fv(G,M,5*4,4),r.viewport(0,0,e.width,e.height);async function y(K){for(;t.next();){const v=t.tick();if(v.beep&&ne.play(),v.vram)break;await X(.05)}r.clearColor(0,0,0,.2),r.clear(r.COLOR_BUFFER_BIT),r.texImage2D(r.TEXTURE_2D,0,r.R8,A.vram_width(),A.vram_height(),0,r.RED,r.UNSIGNED_BYTE,n),r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,b),r.drawElements(r.TRIANGLES,F.length,r.UNSIGNED_SHORT,0),requestAnimationFrame(y)}requestAnimationFrame(y)}const l=document.querySelector("#chip-display");{const t=window.devicePixelRatio??1;l.width=l.clientWidth*t,l.height=l.clientWidth/2*t,E(`Canvas: ${l.width} x ${l.height}`)}const bt=await fetch(V.get("Chip8 Pic")),ht=await bt.arrayBuffer(),yt=new Uint8Array(ht),w=A.new();w.load(yt);const[vt,xt]=[A.vram_width(),A.vram_height()],H=new Uint8Array(re.buffer,w.vram_ptr(),vt*xt),Q=document.querySelector("#key-og"),Et=document.querySelector("#key-map"),L=Q.children,k=Et.children;function Ut(e){document.addEventListener("keydown",t=>{if(t.preventDefault(),p.has(t.key)){const[n,r]=p.get(t.key);e.set_key(n),L[r+1].classList.add("invert"),k[r+1].classList.add("invert")}}),document.addEventListener("keyup",t=>{if(t.preventDefault(),p.has(t.key)){const[n,r]=p.get(t.key);e.unset_key(n),L[r+1].classList.remove("invert"),k[r+1].classList.remove("invert")}})}function Rt(){Q.addEventListener("pointerdown",e=>{e.preventDefault();const t=e.target.dataset.key;if(t){if(p.has(t)){const[n,r]=p.get(t);w.set_key(n),L[r+1].classList.add("invert"),k[r+1].classList.add("invert")}E("pointerdown",t)}}),Q.addEventListener("pointerup",e=>{e.preventDefault();const t=e.target.dataset.key;if(t){if(p.has(t)){const[n,r]=p.get(t);w.unset_key(n),L[r+1].classList.remove("invert"),k[r+1].classList.remove("invert")}E("pointerdown",t)}})}Ut(w);Rt();const N=document.querySelector("#roms");N.addEventListener("change",async e=>{const t=V.get(N.value),n=await(await fetch(t)).arrayBuffer(),r=new Uint8Array(n);w.load(r)});for(let[e,t]of V){const n=document.createElement("option");n.value=e,n.textContent=e,N.appendChild(n)}try{window.navigator?.gpu?(E("Rendering using WebGPU"),lt(l,w,H)):window.WebGL2RenderingContext?(E("WebGPU not available. Falling back to WebGL"),wt(l,w,H)):d("No Renderer available")}catch(e){console.error(`${e}`);const t=l.getContext("2d")??d("No 2d canvas context");se(t,`${e}`)}
