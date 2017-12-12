attribute vec4 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec4 aVertexColor;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying highp vec2 vTextureCoord;
varying lowp vec4 vColor;

void main() {
    gl_Position = uProjectionMatrix * uModelViewMatrix * (
        vec4(
            aVertexPosition.y,
            aVertexPosition.x,
            aVertexPosition.z,
            1
        )
    );
    vColor = aVertexColor;
    vTextureCoord = aTextureCoord;
}