import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Creators } from '@app/actions';

import SceneViewport from 'src/components/scene-components/scene-viewport';
import styled from 'styled-components';
import SceneColorInput from '@app/components/scene-components/inputs/scene-color-input';
import Color from '@app/types/color';

import Scene from '@app/components/scenes/scene';

const scene = new Scene();

export type Props = {

};

export type State = {
  editor: {
    sampleValue: number,
    textInput: string,
    color: Color
  }
};

class ColorInput extends React.Component<Props, State> {
  constructor( props ) {
    super( props );
    this.state = {
      editor: {
        sampleValue: 0,
        textInput: '',
        color: {
          r: 0,
          g: 0,
          b: 0,
          a: 1
        }
      }
    }
  }

  setEditorValue = ( name: string, value: any ) => {
    this.setState( {
      editor: {
        ...this.state.editor,
        [ name ]: value
      }
    } );
  };

  render () {
    const { editor } = this.state;
    return (
      <SceneWrapper>
        <h3>Color Input</h3>
        <SceneAndInputsWrapper>
          <SceneViewportWrapper>
            <SceneViewport scene={ scene } args={ editor }  />
          </SceneViewportWrapper>

          <SceneInputsWrapper>
            <SceneColorInput name={ 'Color Input' }
                             value={ editor.color }
                             onChange={ val => this.setEditorValue( 'color', val ) } />
          </SceneInputsWrapper>
        </SceneAndInputsWrapper>
      </SceneWrapper>
    );
  }
}

const SceneWrapper = styled.div`
  
`;

const SceneAndInputsWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  
  @media ( max-width: 512px ) {
    flex-direction: column;
  }
`;

const SceneViewportWrapper = styled.div`
`;

const SceneInputsWrapper = styled.div`
  max-width: 312px;
  margin-left: 8px;
`;

const mapStateToProps = ( state ) => {
  return {

  }
};
const mapDispatchToProps = ( dispatch ) =>
  bindActionCreators( Creators, dispatch );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)( ColorInput );

