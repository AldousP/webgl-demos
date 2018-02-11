import * as React from 'react';

import { bindActionCreators } from 'redux';
import { Creators } from '@app/actions';
import { connect } from 'react-redux';

import styled from 'styled-components';

export type Props = {

}

export type State = {

}

class About extends React.Component<Props, State> {
  constructor( props ) {
    super( props );
  }

  render() {
    return (
      <AboutContainer>
        <h3>About</h3>
        <hr />
        <p>
          Miscellaneous demos built with WebGL, Webpack and TypeScript
        </p>
      </AboutContainer>
    );
  }
}

const AboutContainer = styled.div`
  
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
)( About );