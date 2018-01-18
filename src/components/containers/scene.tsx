import * as React from 'react';
import styled from 'styled-components';
import breakpoints from '@app/components/styled/breakpoints';
import EditorValueInput from "@app/components/UI/editor-value-input";

export type EditorValue = {
  name: string;
  type: 'SLIDER' | 'TOGGLE' | 'TEXT';
  value: boolean | string | number;
  config: Object;
}

export type Props = {

}

export type State = {
  name: string
  toolpaneOpen: boolean,
  canvas_w: number,
  canvas_h: number,
  editorValues: Array<EditorValue>
}


export default class Scene extends React.Component<Props, State> {
  constructor ( props ) {
    super( props );
    this.state = {
      name: '',
      toolpaneOpen: true,
      canvas_w: 640,
      canvas_h: 360,
      editorValues: []
    }
  }

  componentDidMount () {
    let canvas: HTMLElement = document.getElementById( 'scene-gl-canvas' );
    window.requestAnimationFrame( this.mainLoop );
  }

  renderToolPane = () => {
    if ( this.state.toolpaneOpen ) {
      return (
        <Toolpane>
          {
            this.state.editorValues.map( ( value, i ) => {
              return (
                <EditorValueInput key={ i } data={ value } />
              )
            } )
          }
        </Toolpane>
      )
    }
  };

  mainLoop = () => {
    window.requestAnimationFrame( this.mainLoop );
  };

  render () {
    return (
      <SceneContainer >
        <Canvas id="scene-gl-canvas"
                width={ this.state.canvas_w }
                height={ this.state.canvas_h }
        />
        { this.renderToolPane() }
      </SceneContainer>
    ) }
}

const SceneContainer = styled.div`
  border: thin solid white;
  display: grid;
  grid-template-columns: 75% 25%;
  justify-content: space-between;
  @media (max-width: ${ breakpoints.small }px) {
    grid-template-columns: 1fr;
    grid-template-rows: 65% 35%;
  }
`;

const Toolpane = styled.div`
  border: thin solid salmon;
`;

const Canvas = styled.canvas`
   max-width: 100%;
   border: thin solid cornflowerblue;
   @media (max-width: ${ breakpoints.small }px) {
    max-width: 95vw;
    max-height: 55vh;
  }
`;


