// fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default
precision mediump float;

varying lowp vec4 v_color;
varying vec2 v_texcoord;

uniform sampler2D u_texture;

void main(void) {
    gl_FragColor = texture2D(u_texture, v_texcoord);
}