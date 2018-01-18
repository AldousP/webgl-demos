import * as React from 'react';
import styled from 'styled-components';
import breakpoints from '@app/components/styled/breakpoints';
import { EditorValue, EditorValueInputType, SliderValue, TextValue } from "@app/components/containers/scene";

export type State = {

}

export type Props = {
  data: EditorValue,
  onChange?: Function
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
                  onChange={ this.props.onChange ? e => (this.props.onChange( e.target.value )) : null }
          />
        );
      case EditorValueInputType.TextInput:
        data = this.props.data as TextValue;
        return (
          <TextInput type="text"
                  maxLength={ data.max }
                  onChange={ this.props.onChange ? e => (this.props.onChange( e.target.value )) : null }
          />
        )
    }
  }

  render () {
    let { name, value } = this.props.data;
    return (
      <ValueWrapper>
        <LabelRow>
          <Name>
            { name }
          </Name>
          <Value>
            { value }
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
`;

const InputRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const LabelRow = styled.div`
  font-size: 12px;
  display: inline-flex;
  justify-content: space-between;
  width: 100%;
`;

const Name = styled.div`
  font-size: 12px;
  padding: 4px;
`;

const Value = styled.div`
  font-size: 12px;
  padding: 4px;
`;

const Slider = styled.input`
  width: 100%;
  max-width: 256px;
`;

const TextInput = styled.input`
  width: 90%;
  max-width: 256px;
`;