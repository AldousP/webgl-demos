import * as React from 'react';
import styled from 'styled-components';
import breakpoints from "@app/components/styled/breakpoints";

type EditorValue = {
  name: string;
  type: string;
  editorConfig: Object;
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

function connectScene ( WrappedComponent ) {
  return class extends React.Component<Props, State> {
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

    renderToolPane () {
      if ( this.state.toolpaneOpen ) {
        return (
          <Toolpane>

          </Toolpane>
        )
      }
    }

    render () {
      return (
        <SceneContainer>
            <Canvas
              width={ this.state.canvas_w }
              height={ this.state.canvas_h }
            />
          { this.renderToolPane() }

          <ChildComponent>
            <WrappedComponent { ...this.props } />
          </ChildComponent>
        </SceneContainer>
      ) }
  }
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

const ChildComponent = styled.div`
  display: none;
`;

const Canvas = styled.canvas`
   max-width: 100%;
   border: thin solid cornflowerblue;
   @media (max-width: ${ breakpoints.small }px) {
    max-width: 95vw;
    max-height: 55vh;
  }
`;

export { connectScene };

