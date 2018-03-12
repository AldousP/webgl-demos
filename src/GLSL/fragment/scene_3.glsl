precision mediump float;

uniform sampler2D uSampler;
uniform float uOffsetX;
uniform float uOffsetY;

varying highp vec2 vTextureCoord;
varying lowp vec4 vColor;

void main (void) {
    gl_FragColor = texture2D(uSampler, vTextureCoord + vec2(uOffsetX, uOffsetY)) * vColor;
}