import Scene from "../scene";
import { Entity } from 'app/ts/entity';
import { degToRad, radToDeg, isPowerOf2 } from 'app/ts/math';
import { mat4, vec4, vec3 } from 'gl-matrix';
import { Mesh, MeshType, VertexLength } from 'app/ts/mesh';

let window = require('window');
window.mat4 = mat4;

let document = window.document;

export default class Scene1 extends Scene {
  gl;

  lastFrame: number = new Date().getTime();
  delta: number;
  vertShader: string = require('app/glsl/vertex/example_3.glsl');
  fragShader: string = require('app/glsl/fragment/example_3.glsl');
  shaderProgram;

  programData: any;

  constructor () {
    super ();

  }

  /**
   * Sets up the scene data | Self executing.
   */
  setup ( canvasID: string ) {
    this.gl = document.getElementById( canvasID ).getContext('webgl');
    let gl = this.gl;

    this.shaderProgram = this.compileShaders();
    this.programData = {
      position: {
        location: gl.getAttribLocation(this.shaderProgram, 'a_vertexPosition'),
        buffer: gl.createBuffer()
      }
    };

    let positions = [
      -.5, .5,
      -.5, -.5,
      0, -.5,
      0, -.5,
      0, .5,
      -.5, .5,
    ];

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.programData.position.buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);
    this.render();
  }

  render () {
    let now = new Date().getTime();
    this.delta = (now - this.lastFrame) / 1000;

    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.gl.useProgram(this.shaderProgram);

    this.gl.enableVertexAttribArray(this.programData.position.location);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.programData.position.buffer);

    let size = 2;
    let type = this.gl.FLOAT;
    let normalize = false;
    let stride = 0;
    let offset = 0;
    this.gl.vertexAttribPointer(this.programData.position.location, size, type, normalize, stride, offset);
    this.gl.drawArrays(this.gl.TRIANGLES, offset, 6);

    this.lastFrame = now;
    window.requestAnimationFrame(() => this.render() );
  }

  /**
   * Uses the vertex and fragment shaders to create a shader program.
   */
  compileShaders() {
    let vShader = this.createShader(this.gl.VERTEX_SHADER, this.vertShader);
    let fShader = this.createShader(this.gl.FRAGMENT_SHADER, this.fragShader);
    let program = this.gl.createProgram();
    this.gl.attachShader(program, vShader);
    this.gl.attachShader(program, fShader);
    this.gl.linkProgram(program);
    let success = this.gl.getProgramParameter(program, this.gl.LINK_STATUS);
    if (success) {
      return program;
    }

    console.log(this.gl.getProgramInfoLog(program));
    this.gl.deleteProgram(program);
  }


  /**
   * Returns a webGL shader for the provided source and parameters.
   *
   * @param type the type of the shader (this.gl.X_SHADER)
   * @param source GLSL shader source
   * @returns {*}
   */
  createShader(type: string, source: string) {
    let shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    let success = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }

    // Used to hold error states.
    console.log(this.gl.getShaderInfoLog(shader));
    this.gl.deleteShader(shader);
  }
}