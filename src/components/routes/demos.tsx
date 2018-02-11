import * as React from 'react';

import { bindActionCreators } from 'redux';
import { Creators } from '@app/actions';
import { connect } from 'react-redux';

import styled from 'styled-components';
import Scene6 from '@app/scenes/scene-6';


export type Props = {
  navOpen: boolean,
  AppSetNavOpen: typeof Creators.AppSetNavOpen
}

export type State = {

}

class Demos extends React.Component<Props, State> {
  constructor( props ) {
    super( props );
  }

  render() {
    return (
      <DemoContainer>
        <Scene6/>
      </DemoContainer>
    );
  }
}

const mapStateToProps = ( state ) => {
  return {

  }
};

const DemoContainer = styled.div`
  
`;

const mapDispatchToProps = ( dispatch ) =>
  bindActionCreators( Creators, dispatch );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)( Demos );