import * as React from 'react';

let classNames = require('classnames');

export interface ViewportProps {
  className?: string,
  canvas_ID: string,
  width: number
  height: number
  mounted?: Function,
}

export interface StateProps {

}

class Viewport extends React.Component<ViewportProps, StateProps> {

  componentDidMount () {
    this.props.mounted();
  }

  render() {
    let style = {
      minWidth: '312px',
      maxWidth: this.props.width + 'px',
      maxHeight: ( this.props.width * .5625),
      width: '100%'
    };
    return (
      <div style={ { maxWidth: this.props.width + 'px'} } className={ classNames('col viewport', this.props.className) }>
        <canvas id={ this.props.canvas_ID }
                width={ this.props.width }
                height={ this.props.height }
                style={ style } >
          Sorry, your browser does not support the canvas element.
        </canvas>
      </div>);
  }
}

export default Viewport;