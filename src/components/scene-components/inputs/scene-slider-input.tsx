import styled from 'styled-components';
import * as React from 'react';

type Props = {
  name: string,
  onChange: ( value: number ) => void,
  min?: number,
  max?: number,
  step?: number,
  value?: number
}

type State = {

}

export default class SceneSliderInput extends React.Component<Props, State> {

  static defaultProps = {
    min: 0,
    max: 100,
    step: 1,
    value: 0
  };

  onChange = ( e) => {
    const value: number = e.target.value;
    this.props.onChange( value );
  };

  render () {
    return (
      <SliderInputWrapper>
        <TopRow>
          <span> { this.props.name }</span>
          <span> { Math.round( this.props.value * 100 ) / 100 } </span>
        </TopRow>
        <input type="range"
               min={ this.props.min }
               max={ this.props.max }
               step={ this.props.step }
               value={ this.props.value || 0 }
               onChange={ this.onChange }
        />
      </SliderInputWrapper>
    );
  }
}

const SliderInputWrapper = styled.div`
  border: 2px solid ${ props => props.theme.trimColor };
  border-radius: 2px;
  margin-top: 2px;
  margin-bottom: 2px;
  padding: 12px;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
`;