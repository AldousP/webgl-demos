import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Creators } from 'src/actions/index';

import SceneViewport from 'src/components/scene-components/scene-viewport';
import styled from 'styled-components';
import SceneSliderInput from 'src/components/scene-components/inputs/scene-slider-input';

const scene = {
  // editor: {
  //   sampleTextInput: {
  //     type: 'text',
  //     maxLength: 10,
  //     value: 'initial value'
  //   }
  // }
  update () {

  }
};

export type Props = {

};

export type State = {
  editor: {
    sampleValue: number
  }
}
;

class SampleScene extends React.Component<Props, State> {
  constructor( props ) {
    super( props );
    this.state = {
      editor: {
        sampleValue: 0
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
            <SceneViewport scene={ scene } />
          </SceneViewportWrapper>

          <SceneInputsWrapper>
            <SceneSliderInput name={ 'Sample Slider'}
                              value={ editor.sampleValue }
                              min={ 0 }
                              max={ 100}
                              step={ 0.1 }
                              onChange={ val => this.setEditorValue( 'sampleValue', val ) }
            />
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

