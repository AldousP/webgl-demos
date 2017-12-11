attribute vec4 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec4 aVertexColor;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;
uniform float uFuzzing;

varying highp vec2 vTextureCoord;
varying lowp vec4 vColor;

void main() {
    gl_Position = uProjectionMatrix * uModelViewMatrix * (
        vec4(
            aVertexPosition.x * uFuzzing,
            aVertexPosition.y * uFuzzing,
            aVertexPosition.z * uFuzzing,
            1
        )
    );
    vColor = aVertexColor;
    vTextureCoord = aTextureCoord;
}