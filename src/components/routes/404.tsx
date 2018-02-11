import * as React from 'react';

import { bindActionCreators } from 'redux';
import { Creators } from '@app/actions';
import { connect } from 'react-redux';
import { randRange } from '@app/util/math';

import styled from 'styled-components';

const NotFoundContainer = styled.div`
  
`;

const messages = [
  "? Never heard of it."
];

export type Props = {
  location: {
    pathname: string,
    search: string,
    hash: string
  }
}

export type State = {
  messageIndex: number
}

class NotFound extends React.Component<Props, State> {
  constructor( props ) {
    super( props );
    this.state = {
      messageIndex: 0
    }
  }

  componentDidUpdate ( prevProps ) {
    if ( this.props.location !== prevProps.location ) {
      this.setState({
        messageIndex: randRange(0, messages.length - 1)
      })
    }
  }

  render() {
    const path = this.props.location.pathname.split( '/' )[ 1 ];
    return (
      <NotFoundContainer>
        <h1>404</h1>
        <hr />
        <p>{ `${ path }${ messages[ this.state.messageIndex ] }`}</p>
      </NotFoundContainer>
    );
  }
}

const mapStateToProps = ( state ) => {
  return {

  }
};

const mapDispatchToProps = ( dispatch ) =>
  bindActionCreators( Creators, dispatch );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)( NotFound );