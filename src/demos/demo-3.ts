import { Entity } from '../ts/entity';
import { degToRad, radToDeg, isPowerOf2 } from "../ts/math";
import { mat4, vec4, vec3 } from "gl-matrix";

let window = require('window');
window.mat4 = mat4;


let lastFrame: number = new Date().getTime();
let delta: number;

let document = window.document;
let gl = document.getElementById('webgl_example').getContext('webgl');

if (!gl) {
  console.error('No WebGL context available.');
}

let vertShader: string = require('app/glsl/vertex/example_3.glsl');
let fragShader: string = require('app/glsl/fragment/example_3.glsl');
let shaderProgram;

let positionLocation: string; // References to the shader's attributes
let transformLocation: string;
let positionBuffer;

let entities: Array<Entity> = [];

let cameraAngleRadians = degToRad(0);
let fieldOfViewRadians = degToRad(60);

/**
 * Call to start the render loop.
 */
let cameraMatrix = mat4.create();
let viewMatrix = mat4.create();
let projectionMatrix = mat4.create();
let viewProjectionMatrix = mat4.create();

let cameraPosition = vec3.fromValues(0, 0, -1);
let target = vec3.fromValues(0, 0, 0);
let up = vec3.fromValues(0, 1, 0);

let aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
let camNear = 1;
let camFar = 2000;
let shaderTransform = mat4.create();

let ySlider = document.getElementById('y-slider');

ySlider.onchange = (event) => {
  target = vec3.fromValues(0, event.target.value, 0);
};

/**
 * Sets up the scene data | Self executing.
 */
(function setup() {
  let entityA = new Entity();
  entityA.mesh = [
    -.25, .25, 0,
    -.25, -.25, 0,
    .25, .25, 0,
    .25, -.25, 0
  ];

  let entityB = new Entity();
  entityB.transform = mat4.create();
  mat4.translate(entityB.transform, entityB.transform, vec3.fromValues(-.55, -.35, 0));

  mat4.rotateX(entityB.transform, entityB.transform, Math.PI / 3);
  mat4.rotateY(entityB.transform, entityB.transform, Math.PI / 8);
  mat4.rotateZ(entityB.transform, entityB.transform, Math.PI / 16);

  entityB.mesh = [
    -.115, .115, 0,
    -.115, -.115, 0,
    .115, .115, 0,
    .115, -.115, 0
  ];

  entities.push(entityA);
  entities.push(entityB);
  shaderProgram = compileShaders();
  setupShaderData();
  render();
})();


function render () {
  let now = new Date().getTime();
  delta = (now - lastFrame) / 1000;

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;

  mat4.identity(projectionMatrix);
  mat4.perspective(projectionMatrix, fieldOfViewRadians, aspect, 1, 200);
  mat4.lookAt(cameraMatrix, cameraPosition, target, up);
  mat4.invert(viewMatrix, cameraMatrix);
  mat4.multiply(viewProjectionMatrix, projectionMatrix, viewMatrix);

  entities.forEach((entity, index) => {
    drawEntity(entity);
  });

  lastFrame = now;
  window.requestAnimationFrame(render);
}

/**
 * Uses the vertex and fragment shaders to create a shader program.
 */
function compileShaders() {
  let vShader = createShader(gl.VERTEX_SHADER, vertShader);
  let fShader = createShader(gl.FRAGMENT_SHADER, fragShader);
  let program = gl.createProgram();
  gl.attachShader(program, vShader);
  gl.attachShader(program, fShader);
  gl.linkProgram(program);
  let success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}


/**
 * Returns a webGL shader for the provided source and parameters.
 *
 * @param type the type of the shader (gl.X_SHADER)
 * @param source GLSL shader source
 * @returns {*}
 */
function createShader(type, source) {
  let shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  // Used to hold error states.
  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

/**
 * Initializes buffers for shader data.
 */
function setupShaderData() {
  positionLocation = gl.getAttribLocation(shaderProgram, 'a_vertexPosition');
  transformLocation = gl.getUniformLocation(shaderProgram, 'u_matrix');
  positionBuffer = gl.createBuffer();
}

/**
 * Sets the geometry position attribute of the shader.
 * @param {"gl-matrix".vec4} position
 */
function setShaderPositionData(position: Array<number>) {
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position), gl.STATIC_DRAW);
}

/**
 * Sets the transform attribute of the shader.
 * @param {"gl-matrix".mat4} transform
 */
function setShaderTransformData(transform: mat4) {
  mat4.multiply(shaderTransform, viewProjectionMatrix, transform);
  gl.uniformMatrix4fv(transformLocation, false, shaderTransform);
}

/**
 * Draws an {@link Entity} to the scene based on its transform and
 * geometry mesh.
 *
 * @param {Entity} entity
 */
function drawEntity(entity: Entity) {
  gl.useProgram(shaderProgram);

  setShaderTransformData(entity.transform);
  setShaderPositionData(entity.mesh);

  gl.enableVertexAttribArray(positionLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  let size = 3;          // 2 components per iteration
  let type = gl.FLOAT;   // the data is 32bit floats
  let normalize = false; // don't normalize the data
  let stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
  let offset = 0;        // start at the beginning of the buffer

  gl.vertexAttribPointer(positionLocation, size, type, normalize, stride, offset);
  gl.drawArrays(gl.TRIANGLE_STRIP, offset, 4);
}

