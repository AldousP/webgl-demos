import Scene from "../scene";
import { Entity } from 'app/ts/entity';
import { degToRad, radToDeg, isPowerOf2 } from 'app/ts/math';
import { mat4, vec4, vec3 } from 'gl-matrix';
import { Mesh, MeshType, VertexLength } from 'app/ts/mesh';

let twgl = require('twgl.js');
let primitives = twgl.primitives;

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

  positionLocation: string; // References to the shader's attributes
  transformLocation: string;
  positionBuffer;

  entities: Array<Entity> = [];
  cubeModel = primitives.createCubeVertices(1.5);

  cameraAngleRadians = degToRad(0);
  fieldOfViewRadians = degToRad(60);

  /**
   * Call to start the render loop.
   */
  cameraMatrix = mat4.create();
  viewMatrix = mat4.create();
  projectionMatrix = mat4.create();
  viewProjectionMatrix = mat4.create();

  cameraPosition = vec3.fromValues(0, 0, -5);
  target = vec3.fromValues(0, 0, 0);
  up = vec3.fromValues(0, 1, 0);

  camNear = 1;
  camFar = 2000;
  aspect: number;

  shaderTransform = mat4.create();

  appState = {
    cam_X: 0,
    cam_Y: 0,
    cam_Z: 0,
    front_face: 0,
    back_face: 200
  };

  constructor () {
    super ();
  }

  /**
   * Sets up the scene data | Self executing.
   */
  setup ( canvasID: string ) {
    this.gl = document.getElementById( canvasID ).getContext('webgl');

    this.aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;

    let entityA = new Entity();
    entityA.mesh = new Mesh();
    entityA.mesh.data = this.cubeModel.position;
    entityA.mesh.meshType = MeshType.TRIANGLES;
    entityA.mesh.vertexLength = VertexLength.THREE;

    let entityB = new Entity();
    entityB.transform = mat4.create();
    mat4.translate(entityB.transform, entityB.transform, vec3.fromValues(-.85, -.85, 0));

    // mat4.rotateX(entityB.transform, entityB.transform, Math.PI / 3);
    // mat4.rotateY(entityB.transform, entityB.transform, Math.PI / 8);
    // mat4.rotateZ(entityB.transform, entityB.transform, Math.PI / 16);

    entityB.mesh = new Mesh();
    entityB.mesh.data = this.cubeModel.position;
    entityB.mesh.meshType = MeshType.TRIANGLES;
    entityB.mesh.vertexLength = VertexLength.THREE;

    this.entities.push(entityA);
    this.entities.push(entityB);
    this.shaderProgram = this.compileShaders();
    this.setupShaderData();
    this.render();
  }

  render () {
    let now = new Date().getTime();
    this.delta = (now - this.lastFrame) / 1000;

    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;

    vec3.set(
      this.target,
      this.appState.cam_X,
      this.appState.cam_Y,
      this.appState.cam_Z
    );

    mat4.identity(this.projectionMatrix);
    mat4.perspective(
      this.projectionMatrix,
      this.fieldOfViewRadians,
      this.aspect,
      this.appState.front_face,
      this.appState.back_face);
    mat4.lookAt(this.cameraMatrix, this.cameraPosition, this.target, this.up);
    mat4.invert(this.viewMatrix, this.cameraMatrix);
    mat4.multiply(this.viewProjectionMatrix, this.projectionMatrix, this.viewMatrix);

    this.entities.forEach((entity, index) => {
      this.drawEntity(entity);
    });

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

  /**
   * Initializes buffers for shader data.
   */
  setupShaderData() {
    this.positionLocation = this.gl.getAttribLocation(this.shaderProgram, 'a_vertexPosition');
    this.transformLocation = this.gl.getUniformLocation(this.shaderProgram, 'u_matrix');
    this.positionBuffer = this.gl.createBuffer();
  }

  /**
   * Sets the geometry position attribute of the shader.
   * @param {"gl-matrix".vec4} position
   */
  setShaderPositionData(position: Array<number>) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(position), this.gl.STATIC_DRAW);
  }

  /**
   * Sets the transform attribute of the shader.
   * @param {"gl-matrix".mat4} transform
   */
  setShaderTransformData(transform: mat4) {
    mat4.multiply(this.shaderTransform, this.viewProjectionMatrix, transform);
    this.gl.uniformMatrix4fv(this.transformLocation, false, this.shaderTransform);
  }

  /**
   * Draws an {@link Entity} to the scene based on its transform and
   * geometry mesh.
   *
   * @param {Entity} entity
   */
  drawEntity(entity: Entity) {
    this.gl.useProgram(this.shaderProgram);

    this.setShaderTransformData(entity.transform);
    this.setShaderPositionData(entity.mesh.data);

    this.gl.enableVertexAttribArray(this.positionLocation);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);

    let size = 3;          // 3 components per iteration
    let type = this.gl.FLOAT;   // the data is 32bit floats
    let normalize = false; // don't normalize the data
    let stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    let offset = 0;        // start at the beginning of the buffer

    this.gl.vertexAttribPointer(this.positionLocation, size, type, normalize, stride, offset);
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, offset, 24);
  }
}