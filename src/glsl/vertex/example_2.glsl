attribute vec3 a_vertexPosition;
attribute vec4 a_vertexColor;
attribute vec2 a_texcoord;

uniform mat4 u_matrix;

varying lowp vec4 v_color;
varying vec2 v_texcoord;

// all shaders have a main function
void main() {
    gl_Position = u_matrix * vec4(a_vertexPosition, 1.0);
    v_color = a_vertexColor;
    v_texcoord = a_texcoord;
}