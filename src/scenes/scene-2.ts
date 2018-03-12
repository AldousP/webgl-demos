import { mat4, vec3 } from "gl-matrix";
import Shader from 'src/types/shader';
import DefaultShader from 'src/shader-wrappers/default';
import Entity from 'src/types/entity';
import { initializeShader, setShaderData } from 'src/util/gl';
import { RenderableScene } from 'src/components/scene-components/scene-viewport';
import Color from '@app/types/color';

interface Args {
  color: Color,
  yaw: number
}

class Scene2 implements RenderableScene {
  shaderTransform: mat4;
  transform: mat4;
  shader: Shader;
  sampleCube: any;
  stopped: boolean;

  constructor () {
    this.shaderTransform = mat4.create();
    this.transform = mat4.create();
    this.stopped = false;
  }

  init ( gl ) {
    this.sampleCube = {
      transform: mat4.create(),
      mesh: {
        modelData: require('static/models/cube.obj').default
      }
    };

    const shader = new DefaultShader();
    this.setShader( shader, gl );
    gl.useProgram( this.shader.program );
  }

  setShader ( shader: Shader, gl ) {
    this.shader = shader;
    initializeShader( shader, gl );
  }

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
  }

  time: number = 0;

  update ( delta: number, args: Args ) {
    this.time += delta;
    const fieldOfView = 90 * Math.PI / 180;
    const aspect = 1;
    const zNear = 0.1;
    const zFar = 100.0;

    mat4.perspective(
      this.transform,
      fieldOfView,
      aspect,
      zNear,
      zFar
    );
    mat4.translate( this.transform, this.transform, [ 0, 0, -3 ]);
    mat4.rotateY( this.transform, this.transform, args.yaw );
  }

  render ( gl: WebGLRenderingContext ) {
    this.renderEntity( this.sampleCube, gl );
  }

  onSwipe ( diff, elapsed ) {

  }
}

export default Scene2;