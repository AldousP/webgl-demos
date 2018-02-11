import * as React from 'react';
import styled from 'styled-components';
import breakpoints from '@app/components/styled/breakpoints';
import { ChromePicker } from 'react-color';

import {
  ColorValue,
  EditorValue, EditorValueInputType, SelectOption, SelectValue, SliderValue,
  TextValue
} from "@app/components/containers/scene";

export type State = {

}

export type Props = {
  data: EditorValue,
  value: number,
  onChange?: ( EditorValue ) => void
}

export default class EditorValueInput extends React.Component<Props, State> {
  constructor () {
    super()
  }

  renderInput () {
    let data;
    switch ( this.props.data.type ) {
      case EditorValueInputType.SliderInput:
        data = this.props.data as SliderValue;
        return (
          <Slider type="range"
                  min={ data.min }
                  max={ data.max }
                  step={ data.increment }
                  value={ this.props.value }
                  onChange={ e => this.props.onChange( Math.round( parseFloat( e.target.value ) * 100) / 100 ) }
          />
        );
      case EditorValueInputType.TextInput:
        data = this.props.data as TextValue;
        return (
          <TextInput type="text"
                  maxLength={ data.max }
                  onChange={ this.props.onChange ? e => ( this.props.onChange( e.target.value ) ) : null }
          />
        );
      case EditorValueInputType.SelectInput:
        data = this.props.data as SelectValue<any>;
        return (
          <SelectInput defaultValue={ '2' } onChange={ this.props.onChange ? e => ( this.props.onChange( e.target.value ) ) : null }>
            {
              data.options.map(
                ( option: SelectOption<any>, index: number ) =>
                  <option value={ option.value } key={ index }> { option.name } </option> )
            }
          </SelectInput>
        );
      case EditorValueInputType.ColorInput:
        data = this.props.data as ColorValue;
        return (
          <div>Color Picker</div>
        )
    }
  }

  render () {
    let { name, type } = this.props.data;
    return (
      <ValueWrapper>
        <LabelRow>
          <Name>
            { name }
          </Name>
          <Value>
            {
              type === EditorValueInputType.SliderInput ?
                <SliderDirectInput type="number" step={ 0.1 } value={ this.props.value } onChange={ e => this.props.onChange( e.target.value )}/> : ''
            }
          </Value>
        </LabelRow>
        <InputRow>
          {
            this.renderInput()
          }
        </InputRow>
      </ValueWrapper>
    )
  }
}

const ValueWrapper = styled.div`
  background-color: ${ props => props.theme.editor.valueBackground };
  border-radius: 2px;
  margin: 4px;
  padding: 8px;
  color: ${ props => props.theme.color };
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
`;

const InputRow = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
`;

const LabelRow = styled.div`
  font-size: 12px;
  display: inline-flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 8px;
`;

const Name = styled.div`
 
`;

const Value = styled.div`
  
`;

const Slider = styled.input`
  width: 100%;
`;

const TextInput = styled.input`
  background-color: ${ props => props.theme.background };
  color: ${ props => props.theme.color };
  outline: none;
  padding: 3px;
  border-radius: 3px;
  border: none;
  font-size: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  
  :focus {
    outline: none;
  }
`;

const SelectInput = styled.select`
  background-color: ${ props => props.theme.background };
  color: ${ props => props.theme.color };
  outline: none;
  padding: 3px;
  border-radius: 3px;
  border: none;
  font-size: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  width: 100%;
  
  :focus {
    outline: none;
  }
`;

const SliderDirectInput = styled.input`
  width: 48px;
`;