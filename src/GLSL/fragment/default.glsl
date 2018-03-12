// fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default
precision mediump float;

varying lowp vec4 v_color;

void main(void) {
    gl_FragColor = v_color;
}