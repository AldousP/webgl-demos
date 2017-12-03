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
  vertShader: string = require('app/glsl/vertex/scene_1.glsl');
  fragShader: string = require('app/glsl/fragment/scene_1.glsl');
  shaderProgram;

  programData: any;
  projectionMatrix: mat4;
  modelViewMatrix: mat4;

  appState = {
    fieldOfView: 45 * Math.PI / 180,
    aspect: 1.77,
    zNear: 0.1,
    zFar: 100.0
  };

  paneConfig = {
    fieldOfView: {
      min: 0,
      max: 3
    },
    aspect: {
      min: 0,
      max: 2
    },
    zNear: {
      min: 0,
      max: 10,
      step: .01
    },
    zFar: {
      min: 0,
      max: 10,
      step: .01
    }
  };

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
        location: gl.getAttribLocation(this.shaderProgram, 'aVertexPosition'),
        buffer: gl.createBuffer()
      },
      color: {
        location: gl.getAttribLocation(this.shaderProgram, 'aVertexColor'),
        buffer: gl.createBuffer()
      },
      projectionMatrix: {
        location: gl.getUniformLocation(this.shaderProgram, 'uProjectionMatrix')
      },
      modelViewMatrix: {
        location: gl.getUniformLocation(this.shaderProgram, 'uModelViewMatrix')
      }
    };

    const colors = [
      1.0,  1.0,  1.0,  1.0,    // white
      1.0,  0.0,  0.0,  1.0,    // red
      0.0,  1.0,  0.0,  1.0,    // green
      0.0,  0.0,  1.0,  1.0,    // blue
    ];

    const positions = [
      .5,  .5,
      -.5,  .5,
      .5, -.5,
      -.5, -.5,
    ];

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.programData.position.buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.programData.color.buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);

    this.projectionMatrix = mat4.create();
    this.modelViewMatrix = mat4.create();

    mat4.translate(
      this.modelViewMatrix,     // destination matrix
      this.modelViewMatrix,     // matrix to translate
      [-0.0, 0.0, -6.0]
    );  // amount to translate

    this.render( this.gl );
  }

  render ( gl ) {
    let now = new Date().getTime();
    this.delta = (now - this.lastFrame) / 1000;

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(
      this.projectionMatrix,
      this.appState.fieldOfView,
      this.appState.aspect,
      this.appState.zNear,
      this.appState.zFar);

    {
      const numComponents = 2;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;

      gl.bindBuffer(gl.ARRAY_BUFFER, this.programData.position.buffer);
      gl.vertexAttribPointer(
        this.programData.position.location,
        numComponents,
        type,
        normalize,
        stride,
        offset);
      gl.enableVertexAttribArray(this.programData.position.location);
    }

    {
      const numComponents = 4;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, this.programData.color.buffer);
      gl.vertexAttribPointer(
        this.programData.color.location,
        numComponents,
        type,
        normalize,
        stride,
        offset);
      gl.enableVertexAttribArray(this.programData.color.location);
    }

    gl.useProgram(this.shaderProgram);
    gl.uniformMatrix4fv(
      this.programData.projectionMatrix.location,
      false,
      this.projectionMatrix);

    gl.uniformMatrix4fv(
      this.programData.modelViewMatrix.location,
      false,
      this.modelViewMatrix);

    const offset = 0;
    const vertexCount = 4;
    gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);

    this.lastFrame = now;
    window.requestAnimationFrame(() => this.render( gl ) );
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