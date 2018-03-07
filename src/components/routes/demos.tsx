import * as React from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import styled from 'styled-components';

import { Creators } from '@app/actions';
import ColorInput from '@app/components/scenes/color-input';

export type Props = {
  navOpen: boolean,
  AppSetNavOpen: typeof Creators.AppSetNavOpen
}

export type State = {

}

const editorConfig = {
  textInput: {
    type: ''
  },
  colorInput: {},
  sliderInput: {}
};

class Demos extends React.Component<Props, State> {
  constructor( props ) {
    super( props );
  }

  render() {
    return (
      <DemoContainer>
        <ColorInput/>
      </DemoContainer>
    );
  }
}

const mapStateToProps = ( state ) => {
  return {

  }
};

const DemoContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const mapDispatchToProps = ( dispatch ) =>
  bindActionCreators( Creators, dispatch );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)( Demos );