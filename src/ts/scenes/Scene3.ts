import Scene from "../scene";
import { Entity } from 'app/ts/entity';
import { degToRad, radToDeg, isPowerOf2 } from 'app/ts/math';
import { mat4, vec4, vec3 } from 'gl-matrix';
import { Mesh, MeshType, VertexLength } from 'app/ts/mesh';

let window = require('window');
window.mat4 = mat4;

let document = window.document;

export default class Scene3 extends Scene {
  gl;

  lastFrame: number = new Date().getTime();
  delta: number;
  vertShader: string = require('app/glsl/vertex/scene_3.glsl');
  fragShader: string = require('app/glsl/fragment/scene_3.glsl');
  shaderProgram;

  programData: any;
  projectionMatrix: mat4;
  modelViewMatrix: mat4;

  assets = {
    wall: require('static/images/wall.jpg')
  };

  textures;

  appState = {
    rotationSpeed: 0.25,
    camX: 0,
    camY: 0,
    camZ: -5.1
  };

  paneConfig = {
    rotationSpeed: {
      min: 0,
      max: 15,
      step: .1
    }
  };



  constructor () {
    super ();
  }

  /**
   * Sets up the scene data | Self executing.
   */
  setup ( canvasID: string ) {
    let gl = document.getElementById( canvasID ).getContext('webgl');
    this.gl = gl;
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
      textureCoord: {
        location: gl.getAttribLocation(this.shaderProgram, 'aTextureCoord'),
        buffer: gl.createBuffer()
      },
      sampler: {
        location: gl.getUniformLocation(this.shaderProgram, 'uSampler')
      },
      offsetX: {
        location: gl.getUniformLocation(this.shaderProgram, 'uOffsetX')
      },
      offsetY: {
        location: gl.getUniformLocation(this.shaderProgram, 'uOffsetY')
      },
      projectionMatrix: {
        location: gl.getUniformLocation(this.shaderProgram, 'uProjectionMatrix')
      },
      modelViewMatrix: {
        location: gl.getUniformLocation(this.shaderProgram, 'uModelViewMatrix')
      },
      indices: {
        // Used to pass index information to gl when using draw elements
        buffer: gl.createBuffer()
      }
    };

    this.textures = {};

    const positions = [
      // Front face
      -1.0, -1.0,  1.0,
      1.0, -1.0,  1.0,
      1.0,  1.0,  1.0,
      -1.0,  1.0,  1.0,

      // Back face
      -1.0, -1.0, -1.0,
      -1.0,  1.0, -1.0,
      1.0,  1.0, -1.0,
      1.0, -1.0, -1.0,

      // Top face
      -1.0,  1.0, -1.0,
      -1.0,  1.0,  1.0,
      1.0,  1.0,  1.0,
      1.0,  1.0, -1.0,

      // Bottom face
      -1.0, -1.0, -1.0,
      1.0, -1.0, -1.0,
      1.0, -1.0,  1.0,
      -1.0, -1.0,  1.0,

      // Right face
      1.0, -1.0, -1.0,
      1.0,  1.0, -1.0,
      1.0,  1.0,  1.0,
      1.0, -1.0,  1.0,

      // Left face
      -1.0, -1.0, -1.0,
      -1.0, -1.0,  1.0,
      -1.0,  1.0,  1.0,
      -1.0,  1.0, -1.0,
    ];

    const faceColors = [
      [1.0,  1.0,  1.0,  1.0],    // Front face: white
      [1.0,  0.0,  0.0,  1.0],    // Back face: red
      [0.0,  1.0,  0.0,  1.0],    // Top face: green
      [0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
      [1.0,  1.0,  0.0,  1.0],    // Right face: yellow
      [1.0,  0.0,  1.0,  1.0],    // Left face: purple
    ];

    //  Build the colors for each vertex on the cube
    let colors = [];
    for (let j = 0; j < faceColors.length; j++) {
      const c = faceColors[j];
      // Repeat each color four times for the four vertices of the face
      colors = colors.concat(c, c, c, c);
    }

    const textureCoordinates = [
      // Front
      0.0,  0.0,
      1.0,  0.0,
      1.0,  1.0,
      0.0,  1.0,
      // Back
      0.0,  0.0,
      1.0,  0.0,
      1.0,  1.0,
      0.0,  1.0,
      // Top
      0.0,  0.0,
      1.0,  0.0,
      1.0,  1.0,
      0.0,  1.0,
      // Bottom
      0.0,  0.0,
      1.0,  0.0,
      1.0,  1.0,
      0.0,  1.0,
      // Right
      0.0,  0.0,
      1.0,  0.0,
      1.0,  1.0,
      0.0,  1.0,
      // Left
      0.0,  0.0,
      1.0,  0.0,
      1.0,  1.0,
      0.0,  1.0,
    ];

    const indices = [
      0,  1,  2,      0,  2,  3,    // front
      4,  5,  6,      4,  6,  7,    // back
      8,  9,  10,     8,  10, 11,   // top
      12, 13, 14,     12, 14, 15,   // bottom
      16, 17, 18,     16, 18, 19,   // right
      20, 21, 22,     20, 22, 23,   // left
    ];

    gl.bindBuffer(gl.ARRAY_BUFFER, this.programData.position.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.programData.color.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.programData.textureCoord.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.programData.indices.buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    this.projectionMatrix = mat4.create();
    this.modelViewMatrix = mat4.create();

    // Setup texture data
    this.textures.wall = gl.createTexture();

    const image = new Image();
    image.src = this.assets.wall;
    image.onload = () => {
      const level = 0;
      const internalFormat = gl.RGBA;
      const srcFormat = gl.RGBA;
      const srcType = gl.UNSIGNED_BYTE;
      gl.bindTexture(gl.TEXTURE_2D, this.textures.wall);
      gl.texImage2D(
        gl.TEXTURE_2D,
        level,
        internalFormat,
        srcFormat,
        srcType,
        image
      );

      // WebGL1 has different requirements for power of 2 images
      // vs non power of 2 images so check if the image is a
      // power of 2 in both dimensions.
      if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
        // Yes, it's a power of 2. Generate mips.
        gl.generateMipmap(gl.TEXTURE_2D);
      } else {
        // No, it's not a power of 2. Turn of mips and set
        // wrapping to clamp to edge
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      }

      this.render( gl );
    };
  }

  render ( gl ) {
    let now = new Date().getTime();
    this.delta = (now - this.lastFrame) / 1000;

    this.updateScene( this.delta );
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(
      this.projectionMatrix,
      45 * Math.PI / 180,
      1.6,
      0.1,
      100.0);

    mat4.translate(
      this.projectionMatrix,     // destination matrix
      this.projectionMatrix,     // matrix to translate
      [
        -this.appState.camX,
        -this.appState.camY,
        this.appState.camZ
      ]
    );  // amount to translate

    {
      // Indicates the number of values in each element in the buffer
      // 3D positions will have 3 components each.
      const numComponents = 3;
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
      const num = 2; // every coordinate composed of 2 values
      const type = gl.FLOAT; // the data in the buffer is 32 bit float
      const normalize = false; // don't normalize
      const stride = 0; // how many bytes to get from one set to the next
      const offset = 0; // how many butes inside the buffer to start from
      gl.bindBuffer(gl.ARRAY_BUFFER, this.programData.textureCoord.buffer);
      gl.vertexAttribPointer(this.programData.textureCoord.location, num, type, normalize, stride, offset);
      gl.enableVertexAttribArray(this.programData.textureCoord.location);
    }

    {
      const numComponents = 4;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, this.programData.color.buffer);
      // console.log(this.programData.color.location);
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

    // Tell WebGL which indices to use to index the vertices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.programData.indices.buffer);

    gl.uniform1i(this.programData.sampler.location, 0);

    {
      const vertexCount = 36;
      const type = gl.UNSIGNED_SHORT;
      const offset = 0;
      gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }

    this.lastFrame = now;
    window.requestAnimationFrame(() => this.render( gl ) );
  }

  updateScene( delta ) {
    mat4.rotate(
      this.modelViewMatrix,
      this.modelViewMatrix,
      (this.appState.rotationSpeed) * delta,
      [0, 1, 0]
    );

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