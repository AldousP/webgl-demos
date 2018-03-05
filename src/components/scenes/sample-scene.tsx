import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Creators } from 'src/actions/index';

import SceneViewport from 'src/components/scene-components/scene-viewport';
import styled from 'styled-components';
import SceneSliderInput from 'src/components/scene-components/inputs/scene-slider-input';
import SceneTextInput from '@app/components/scene-components/inputs/scene-text-input';
import SceneColorInput from '@app/components/scene-components/inputs/scene-color-input';
import Color from '@app/types/color';

import { mat4 } from 'gl-matrix';
import Entity from '@app/types/entity';

const cubeEntity: Entity = {
  transform: mat4.create(),
  mesh: {
    modelData: require( 'static/models/cube.obj' ).default
  }
};

const scene = {
  init: ( ) => {
  },

  update: ( delta: number, args: Object ) => {

  },

  close: () => {
    console.log( 'closing' );
  },

  render: ( gl: WebGLRenderingContext ) => {

  }
};

export type Props = {

};

export type State = {
  editor: {
    sampleValue: number,
    textInput: string,
    color: Color
  }
}
;

class SampleScene extends React.Component<Props, State> {
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
      <span>
        <h2>Sample Scene</h2>
        <hr/>
        <SceneAndInputsWrapper>

          <SceneViewportWrapper>
            <SceneViewport scene={ scene } args={ editor }  />
          </SceneViewportWrapper>

          <SceneInputsWrapper>
            <SceneSliderInput name={ 'Sample Slider'}
                              value={ editor.sampleValue }
                              min={ 0 }
                              max={ 100}
                              step={ 0.1 }
                              onChange={ val => this.setEditorValue( 'sampleValue', val ) } />
            <SceneTextInput name={ 'Text Input' }
                            value={ editor.textInput }
                            onChange={ val => this.setEditorValue( 'textInput', val ) } />
            <SceneColorInput name={ 'Color Input' }
                            value={ editor.color }
                            onChange={ val => this.setEditorValue( 'color', val ) } />
          </SceneInputsWrapper>

        </SceneAndInputsWrapper>
      </span>
    );
  }
}

const SceneAndInputsWrapper = styled.div`
  display: flex;
  justify-content: space-around;
`;

const SceneViewportWrapper = styled.div`
  border: thin solid deeppink;
`;

const SceneInputsWrapper = styled.div`
  border: thin solid deepskyblue;
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
)( SampleScene );

