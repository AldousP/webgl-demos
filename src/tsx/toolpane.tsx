import * as React from 'react';

let classNames = require('classnames');

export interface ToolPaneProps {
  className: string
}

export interface ToolPaneState {
  sliderValue: number
}


export interface StateProps {}

class ToolPane extends React.Component<ToolPaneProps, ToolPaneState> {
  constructor (props) {
    super(props);
    this.state = {
      sliderValue: 0
    }
  }

  sliderChange = ( event ) => {
    this.setState({
      sliderValue: event.target.value
    });
  };

  render() {
    return (
      <div className={ classNames('col pane', this.props.className) }>
        <h4>Camera</h4>
        <div >
          <label>X</label>
          <input type="range"
                 min={ -3.14}
                 max={ 3.14 }
                 value={ this.state.sliderValue }
                 onChange={ this.sliderChange } />
        </div>
      </div>
    );
  }
}

export default ToolPane;