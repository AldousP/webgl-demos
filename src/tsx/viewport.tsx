import * as React from 'react';

let classNames = require('classnames');

export interface ViewportProps {
  className: string,
  canvas_ID: string,
  canvas_w: number,
  canvas_h: number,
  mounted?: Function
}

export interface StateProps {

}

class Viewport extends React.Component<ViewportProps, StateProps> {

  componentDidMount () {
    this.props.mounted();
  }

  render() {
    return (
      <div className={ classNames('col pane', this.props.className) }>
        <canvas id={ this.props.canvas_ID } width={ this.props.canvas_w } height={ this.props.canvas_h }>
          Sorry, your browser does not support the canvas element.
        </canvas>
      </div>);
  }
}

export default Viewport;