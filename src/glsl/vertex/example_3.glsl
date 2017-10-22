attribute vec4 a_vertexPosition;
uniform mat4 u_matrix;

varying lowp vec4 v_color;

void main() {
    gl_Position = a_vertexPosition;
    v_color = vec4(1, 1, 1, 1);
}