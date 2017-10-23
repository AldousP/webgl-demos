import 'app/lib/sylvester';
import 'app/lib/matrixUtils';
import 'app/lib/glUtils';
import m4 from 'app/lib/m4';

let window = require('window');
let document = window.document;

let vertShader= require('app/glsl/vertex/example_2.glsl');
let fragShader = require('app/glsl/fragment/example_2.glsl');
let imageData = require('static/teapot.jpg');

var gl;
var program;

var positionLocation;
var texcoordLocation;
var matrixLocation;
var positionBuffer;
var matrixBuffer;
var positions = [
  -.25, .25,
  -.25, -.25,
  .25, .25,
  .25, -.25
];

var colorLocation;
var colorBuffer;
var texcoordsBuffer;
var colors = [
  0.0, 0.0, 1.0, 1.0,
  1.0, 0.0, 0.0, 1.0,
  0.0, 1.0, 0.0, 1.0,
  1.0, 0.0, 1.0, 0.0
];

var translation = [0, 0, 0];
var rotation = [0, 0, 0];
var scale = [2, 2, 2];

var last = new Date().getTime();

/**
 * App start code.
 */
function init () {
  var canvas = document.getElementById('webgl_example');
  gl = canvas.getContext('webgl');

  if (!gl) {
    console.error('No WebGL context available.');
    return;
  }

  compileShaders();
}

/**
 * Perform render calls.
 */
var delta;
function renderLoop () {
  var current = new Date().getTime();
  delta = (current - last) / 1000;
  last = current;

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Use the default shader.
  gl.useProgram(program);

  // Vertex data buffer
  gl.enableVertexAttribArray(positionLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  var size = 2;          // 2 components per iteration
  var type = gl.FLOAT;   // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0;        // start at the beginning of the buffer
  gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);

  // Color data buffer
  // gl.enableVertexAttribArray(colorLocation);
  // gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  // var size = 4;          // 4 components per iteration
  // var type = gl.FLOAT;   // the data is 32bit floats
  // var normalize = false; // don't normalize the data
  // var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
  // var offset = 0;        // start at the beginning of the buffer
  // gl.vertexAttribPointer(colorLocation, size, type, normalize, stride, offset);

  // Texture data buffer
  gl.enableVertexAttribArray(texcoordLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordsBuffer);
  gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0);

  // Compute the matrices
  var matrix = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  ];

  matrix = m4.translate(matrix, translation[0], translation[1], translation[2]);
  matrix = m4.xRotate(matrix, rotation[0]);
  matrix = m4.yRotate(matrix, rotation[1]);
  matrix = m4.zRotate(matrix, rotation[2]);
  matrix = m4.scale(matrix, scale[0], scale[1], scale[2]);

  gl.uniformMatrix4fv(matrixLocation, false, matrix);
  gl.drawArrays(gl.TRIANGLE_STRIP, offset, 4);

  rotation[0] += degToRad(10 * delta);
  rotation[2] += degToRad(10 * delta);
  window.requestAnimationFrame(renderLoop);
}

function isPowerOf2 (value) {
  return (value & (value - 1)) == 0;
}

/**
 * Init shader attributes once program has loaded.
 */
function programInit () {
  positionLocation = gl.getAttribLocation(program, 'a_vertexPosition');
  texcoordLocation = gl.getAttribLocation(program, 'a_texcoord');
  colorLocation = gl.getAttribLocation(program, 'a_vertexColor');
  matrixLocation = gl.getUniformLocation(program, 'u_matrix');

  positionBuffer = gl.createBuffer();
  matrixBuffer = gl.createBuffer();
  colorBuffer = gl.createBuffer();
  texcoordsBuffer = gl.createBuffer();

  // Set buffer data
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordsBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      0, 0,
      0, 1,
      1, 0,
      1, 1
    ]),
    gl.STATIC_DRAW);


  let texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
  // Asynchronously load an image
  let image = new Image();

  image.src = imageData;
  image.addEventListener('load', function () {
    // Now that the image has loaded make copy it to the texture.
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
      // Yes, it's a power of 2. Generate mips.
      gl.generateMipmap(gl.TEXTURE_2D);
    } else {
      // No, it's not a power of 2. Turn off mips and set wrapping to clamp to edge
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
  });

  if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
    // Yes, it's a power of 2. Generate mips.
    gl.generateMipmap(gl.TEXTURE_2D);
  } else {
    // No, it's not a power of 2. Turn off mips and set wrapping to clamp to edge
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  }


  /**
   * Start render loop.
   */
  window.requestAnimationFrame(renderLoop);
}

/**
 * Called when the asset manager has finished loading. Operates on loaded assets.
 *
 * @param assets
 */
function compileShaders () {
  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertShader);
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragShader);
  program = createProgram(gl, vertexShader, fragmentShader);
  programInit();
}

/**
 * Returns a webGL shader for the provided source and parameters.
 *
 * @param gl a gl context
 * @param type the type of the shader (gl.X_SHADER)
 * @param source GLSL shader source
 * @returns {*}
 */
function createShader (gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  // Used to hold error states.
  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

/**
 * Creates the program context by linking the provided shaders.
 *
 * @param gl
 * @param vertexShader
 * @param fragmentShader
 * @returns A linked shader program.
 */
function createProgram (gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

/**
 * Starts the app.
 */
init();

function radToDeg (r) {
  return r * 180 / Math.PI;
}

function degToRad (d) {
  return d * Math.PI / 180;
}


