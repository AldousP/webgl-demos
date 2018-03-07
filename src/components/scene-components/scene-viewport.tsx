import * as React from 'react';
import styled from 'styled-components';

import { mat4, vec2 } from "gl-matrix";
export type SceneProps = {
  /**
   * An instance of a {@link RenderableScene}
   */
  scene: RenderableScene,
  args: any
}

export type SceneState = {

}

/**
 * Interface for a scene used to render to the canvas using a @{link WebGLRenderingContext}
 */
export interface RenderableScene {
  update: ( delta: number, args: Object ) => void;
  render: ( gl: WebGLRenderingContext ) => void;
  init: ( gl: WebGLRenderingContext ) => void;
  onSwipe: ( diff: vec2, elapsed: number ) => void;
}


/**
 * Takes a {@link RenderableScene }
 */
export default class SceneViewport extends React.Component<SceneProps, SceneState> {
  gl: WebGLRenderingContext;
  delta: number = 0;
  last: number = new Date().getTime();

  constructor ( props ) {
    super( props );
  }

  componentDidMount () {
    const window = require( 'window' );
    const canvas: HTMLCanvasElement = window.document.getElementById('scene-gl-canvas' );
    let start: vec2;
    let swipeStart;
    canvas.onmousedown = function ( e: any ) {
      const x = e.offsetX;
      const y = e.offsetY;
      swipeStart = e.timeStamp;
      start = vec2.fromValues( x, y );
    };

    canvas.onmouseup = ( e ) => {
      const x = e.offsetX;
      const y = e.offsetY;
      vec2.sub( start, start, [
        x, y
      ] );

      this.props.scene.onSwipe( start,  ( e.timeStamp - swipeStart ) / 1000 );
    };
    this.gl = canvas.getContext('webgl' );
    this.props.scene.init( this.gl );

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
      this.props.args.color.r / 255,
      this.props.args.color.g / 255,
      this.props.args.color.b / 255,
      1,
    );
    gl.clearDepth( 1.0 );                 // Clear everything
    gl.enable( gl.DEPTH_TEST );           // Enable depth testing
    gl.depthFunc( gl.LEQUAL) ;            // Near things obscure far things
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

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


