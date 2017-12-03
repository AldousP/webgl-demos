import * as React from 'react';
import ValueInput from "./value-input";

let classNames = require('classnames');
import styled from 'styled-components';
import Scene from "./scene";

export interface ToolPaneProps {
  className: string,
  scene?: Scene;
  sceneState: Object;
}

export interface ToolPaneState {
  sliderValue: number
}

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

  componentWillReceiveProps ( nextProps ) {
    console.log(nextProps);
  }

  render() {
    let values = Object.keys(this.props.scene.appState);

    return (
      <div className={ classNames('col tool-pane', this.props.className) }>
        {
          values.map( ( value ) => {
            let min;
            let max;
            let step;

            if (this.props.scene.paneConfig[value]) {
              min = this.props.scene.paneConfig[value].min;
              max = this.props.scene.paneConfig[value].max;
              step = this.props.scene.paneConfig[value].step;
            }

            return <ValueInput key={ value }
                               value_name={ value }
                               step={ step ? step : .1 }
                               min={ min || min === 0 ? min : -10 }
                               max={ max || max === 0 ? max : 10 }
                               value={ this.props.sceneState[value] }
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