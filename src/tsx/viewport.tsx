import * as React from 'react';

let classNames = require('classnames');

export interface ViewportProps {
  className: string
}
export interface StateProps {}

class Viewport extends React.Component<ViewportProps, {}> {
  render() {
    return (
      <div className={ classNames('col pane', this.props.className) }>
        <canvas id="canvas" width="720" height="360">
          Sorry, your browser does not support the canvas element.
        </canvas>
      </div>);
  }
}

export default Viewport;