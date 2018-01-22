attribute vec4 a_position;

uniform mat4 u_transform;

varying lowp vec4 v_color;

void main() {
    gl_Position = a_position * u_transform;
    v_color = vec4( 1, 1, 1, 1 );
}