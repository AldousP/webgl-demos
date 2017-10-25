import * as React from 'react';
import ValueInput from "./value-input";

let classNames = require('classnames');
import styled from 'styled-components';
import Scene from "./scene";

export interface ToolPaneProps {
  className: string,
  scene?: Scene;
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
    let values = Object.keys(this.props.scene.appState);

    return (
      <div className={ classNames('col pane tool-pane', this.props.className) }>
        {
          values.map( ( value ) => {
            return <ValueInput key={ value }
                               value_name={ value }
                               min={ -16 }
                               max={ 16 }
                               value={ 0 }
                               onChange={ ( val ) => {
                                 this.props.scene.updateAppState({
                                   [value]: val
                                 })
                               }}/>
          })
        }
      </div>
    );
  }
}

export default ToolPane;