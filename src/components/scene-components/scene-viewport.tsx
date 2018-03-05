import * as React from 'react';
import styled from 'styled-components';

export type SceneProps = {
  /**
   * An instance of a {@link RenderableScene}
   */
  scene: RenderableScene,
}

export type SceneState = {

}

/**
 * Interface for a scene used to render to the canvas using a @{link WebGLRenderingContext}
 */
export interface RenderableScene {
  update: ( delta: number ) => void;
}

/**
 * Takes a {@link RenderableScene }
 */
export default class SceneViewport extends React.Component<SceneProps, SceneState> {
  gl: WebGLRenderingContext;

  constructor ( props ) {
    super( props );
  }

  componentDidMount () {

  }

  render () {
    return (
      <Canvas id="scene-gl-canvas"
              width={ 300 }
              height={ 300 }/>
    )
  }
}

const Canvas = styled.canvas`

`;


