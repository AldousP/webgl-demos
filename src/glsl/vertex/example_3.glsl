attribute vec4 aVertexPosition;
attribute vec4 aVertexColor;

varying lowp vec4 vColor;

void main() {
    gl_Position = aVertexPosition;
    vColor = vec4(1, 1, 1, 1) * aVertexColor;
}