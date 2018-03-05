import * as React from 'react';
import styled from 'styled-components';

import DefaultShader from '@app/shader-wrappers/default';
import { initializeShader, setShaderData } from '@app/util/gl';
import { mat4 } from "gl-matrix";
import Entity from '@app/types/entity';

export type SceneProps = {
  /**
   * An instance of a {@link RenderableScene}
   */
  scene: RenderableScene,
  args: Object
}

export type SceneState = {

}

/**
 * Interface for a scene used to render to the canvas using a @{link WebGLRenderingContext}
 */
export interface RenderableScene {
  update: ( delta: number, args: Object ) => void;
  render: ( gl: WebGLRenderingContext ) => void;
  init: ( ) => void;
}


const entities = [ {
  transform: mat4.create(),
  mesh: {
    modelData: require( 'static/models/cube.obj' ).default
  }
} ];

/**
 * Takes a {@link RenderableScene }
 */
export default class SceneViewport extends React.Component<SceneProps, SceneState> {
  gl: WebGLRenderingContext;
  delta: number = 0;
  last: number = new Date().getTime();
  shader: DefaultShader = new DefaultShader();
  transform: mat4;
  shaderTransform: mat4;

  constructor ( props ) {
    super( props );
  }

  componentDidMount () {
    const window = require( 'window' );
    const canvas: HTMLCanvasElement = window.document.getElementById('scene-gl-canvas' );
    this.gl = canvas.getContext('webgl' );
    this.props.scene.init();

    initializeShader( this.shader, this.gl );
    this.transform = mat4.create();
    this.shaderTransform = mat4.create();
    requestAnimationFrame( this.update );
  }

  update = () => {
    let current = new Date().getTime();
    let { gl } = this;
    this.delta = (current - this.last) / 1000;
    this.last = current;
    this.props.scene.update( this.delta, this.props.args );
    gl.viewport( 0, 0, gl.canvas.width, gl.canvas.height );
    gl.clearColor(
      0,
      0,
      0,
      1
    );
    gl.clearDepth( 1.0 );                 // Clear everything
    gl.enable( gl.DEPTH_TEST );           // Enable depth testing
    gl.depthFunc( gl.LEQUAL) ;            // Near things obscure far things
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
    gl.useProgram( this.shader.program );

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


    entities.forEach( entity => {
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
    } );


    this.props.scene.render( this.gl );
    requestAnimationFrame( this.update );
  };

  render () {
    return (
      <Canvas id="scene-gl-canvas"
              width={ 300 }
              height={ 300 }/>
    )
  }
}

const Canvas = styled.canvas`
  background-color: black;
`;


