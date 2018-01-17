import * as React from 'react';

import styled from 'styled-components';

const Canvas = styled.canvas`
  border: thin solid ${ props => props.theme.trimColor };
`;

export type Props = {
  width?: number,
  height?: number
};

export type State = {

}

class Viewport extends React.Component<Props, State> {

  static defaultProps = {
    width: 300,
    height: 300
  };

  constructor ( props ) {
    super( props );

  }

  componentDidMount () {

  }

  render() {
    return (
      <div>
        <Canvas width={ this.props.width } height={ this.props.height }>
          Sorry, your browser does not support the canvas element.
        </Canvas>
      </div>);
  }
}

export default Viewport;