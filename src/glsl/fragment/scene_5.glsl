precision mediump float;

uniform sampler2D uSampler;

varying highp vec2 vTextureCoord;
varying highp vec3 vLighting;

varying lowp vec4 vColor;

void main (void) {
    highp vec4 texelColor = texture2D(uSampler, vTextureCoord);
    gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
}