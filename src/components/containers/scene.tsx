import { Sequencer } from 'src/util/sequencer';
import * as React from 'react';
import Viewport from '@app/components/UI/viewport';
import ToolPane from '@app/components/UI/toolpane';
import styled from 'styled-components';

export type SceneProps = {

}

export type SceneState = {
  name: string
  toolpaneOpen: boolean
}

const SceneContainer = styled.div`
  
`;

export default class Scene<P, S> extends React.Component<SceneProps & P, SceneState & S> {
  sceneState: Object; // Control internal app state.
  scenePaneConfig: Object; // UI representation of state data
  programData: Object; // Buffers and pointers used by the scene shader
  paneConfig: Object = {};
  appState: Object = {};
  textures: Object;
  sequencers: Array<Sequencer>;

  constructor ( props ) {
    super ( props );

  }

  componentDidMount () {
    this.setState({
      toolpaneOpen: true
    });

    console.log( this.state.name );
  }

  render () {
    return (
      <SceneContainer>
        <Viewport />
        <ToolPane />
      </SceneContainer>
    )
  }
}

