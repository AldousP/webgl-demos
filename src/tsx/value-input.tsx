import * as React from 'react';

import styled from 'styled-components';

let classNames = require('classnames');

export interface ValueInputState {
  value: number
}

export interface ValueInputProps {
  value_name: string,
  min: number,
  max: number,
  step: number,
  value: number,
  onChange?: Function
}

class ValueInput extends React.Component<ValueInputProps, ValueInputState> {
  constructor (props) {
    super(props);

    this.state = {
      value: this.props.value
    }
  }

  inputChange = ( event ) => {
    this.setState({
      value: event.target.value
    }, this.valueChange)
  };

  sliderChange = ( event ) => {
    this.setState({
      value: event.target.value
    }, this.valueChange);
  };

  valueChange = () => {
    if (this.props.onChange) {
      this.props.onChange( this.state.value );
    }
  };

  render() {
    return (
      <div className='value-input' >
        <div className="label">
          <div> { this.props.value_name } </div>
        </div>
        <div className="">
          <input className="input-value"
                 type="number"
                 min={ this.props.min }
                 max={ this.props.max }
                 value={ this.state.value }
                 onChange={ this.inputChange } />
        </div>
        <div className="">
          <input type="range"
                 min={ this.props.min }
                 max={ this.props.max }
                 step={ this.props.step }
                 value={ this.state.value }
                 onChange={ this.sliderChange } />

        </div>
      </div>
    );
  }
}

export default ValueInput;