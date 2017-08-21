attribute vec3 a_vertexPosition;
attribute vec4 a_vertexColor;

varying lowp vec4 v_color;

// all shaders have a main function
void main() {
    gl_Position = vec4(a_vertexPosition, 1.0);
    v_color = a_vertexColor;
}