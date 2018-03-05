import styled from 'styled-components';
import * as React from 'react';

type Props = {
  name: string,
  onChange: ( value: string ) => void,
  min?: number,
  max?: number,
  value?: string
}

type State = {

}

export default class SceneTextInput extends React.Component<Props, State> {

  static defaultProps = {
    min: 0,
    max: 100,
    value: 0
  };

  onChange = ( e) => {
    const value: string = e.target.value;
    this.props.onChange( value );
  };

  render () {
    return (
      <TextInputWrapper>
        <TopRow>
          <span> { this.props.name }</span>
        </TopRow>
        <input type="text"
               minLength={ this.props.min }
               maxLength={ this.props.max }
               value={ this.props.value }
               onChange={ this.onChange }
        />
      </TextInputWrapper>
    );
  }
}

const TextInputWrapper = styled.div`
  border: thin solid black;
  margin-top: 2px;
  margin-bottom: 2px;
  padding: 4px;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
`;