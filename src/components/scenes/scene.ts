import { mat4 } from "gl-matrix";
import Shader from '@app/types/shader';
import DefaultShader from '@app/shader-wrappers/default';
import { Entry } from 'webpack';
import Entity from '@app/types/entity';
import { initializeShader, setShaderData } from '@app/util/gl';

const scene = {
  shaderTransform: mat4.create(),
  transform: mat4.create(),
  shader: null,
  sampleCube: null,
  init: function ( gl ) {
    this.sampleCube = {
      transform: mat4.create(),
      mesh: {
        modelData: require('static/models/cube.obj').default
      }
    };

    const shader = new DefaultShader();
    this.setShader( shader, gl );
    gl.useProgram( this.shader.program );
  },

  setShader: function ( shader: Shader, gl ) {
    this.shader = shader;
    initializeShader( shader, gl );
  },

  renderEntity ( entity: Entity, gl: WebGLRenderingContext ) {
    mat4.identity( this.shaderTransform );
    mat4.mul( this.shaderTransform, this.transform, entity.transform );
    setShaderData( gl, this.shader, entity, this.shaderTransform );
    {
      const vertexCount = entity.mesh.modelData.indices.length;
      const type = gl.UNSIGNED_SHORT;
      const offset = 0;
      gl.drawElements(
        gl.LINE_LOOP,
        vertexCount,
        type,
        offset
      );
    }
  },

  update: function ( delta: number, args: Object ) {
    const fieldOfView = 120 * Math.PI / 180;
    const aspect = 1.45;
    const zNear = 0.1;
    const zFar = 100.0;

    mat4.perspective(
      this.transform,
      fieldOfView,
      aspect,
      zNear,
      zFar
    );

    mat4.rotateX( this.sampleCube.transform, this.sampleCube.transform, delta );
  },

  render: function ( gl: WebGLRenderingContext ) {
    this.renderEntity( this.sampleCube, gl );
  },

  close: function () {
    console.log( 'closing' );
  },
};

export default scene;