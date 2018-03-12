import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Creators } from '@app/actions';

import SceneViewport from 'src/components/scene-components/scene-viewport';
import styled from 'styled-components';
import SceneColorInput from '@app/components/scene-components/inputs/scene-color-input';
import Color from '@app/types/color';
import Scene2 from '@app/scenes/scene-2';
import breakpoints from '@app/components/styled/breakpoints';
import SceneSliderInput from '@app/components/scene-components/inputs/scene-slider-input';

const scene = new Scene2();

export type Props = {

};

export type State = {
  editor: {
    yaw: number,
    color: Color
  }
};

class SceneTwo extends React.Component<Props, State> {
  constructor( props ) {
    super( props );
    this.state = {
      editor: {
        yaw: 0,
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
        <h3>Scene Two</h3>
        <SceneAndInputsWrapper>
          <SceneViewportWrapper>
            <SceneViewport scene={ scene } args={ editor }  />
          </SceneViewportWrapper>

          <SceneInputsWrapper>
            <SceneSliderInput name={ 'Yaw' }
                              value={ editor.yaw }
                              max={ Math.PI }
                              min={ -Math.PI }
                              step={ .01 }
                              onChange={ val => this.setEditorValue( 'yaw', val ) } />
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
  @media (max-width: ${ breakpoints.small }px) {
    margin-left: 0;
  }
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
)( SceneTwo );

