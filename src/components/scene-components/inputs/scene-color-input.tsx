import styled from 'styled-components';
import * as React from 'react';
import { HuePicker} from 'react-color';
import Color from '@app/types/color';

type Props = {
  name: string,
  onChange: ( value: Color) => void,
  value?: Color
}

type State = {

}

export default class SceneColorInput extends React.Component<Props, State> {

  static defaultProps = {
    value: null
  };

  onChange = ( e ) => {
    const value: Color = e.rgb;
    this.props.onChange( value );
  };

  render () {
    return (
      <ColorInputWrapper>
        <TopRow>
          <div> { this.props.name }</div>
        </TopRow>
        <HuePicker
          width={ 164 }
          color={ this.props.value }
          onChangeComplete={ this.onChange }
        />
      </ColorInputWrapper>
    );
  }
}

const ColorInputWrapper = styled.div`
  border: 2px solid ${ props => props.theme.trimColor };
  border-radius: 2px;
  margin-top: 2px;
  margin-bottom: 2px;
  padding: 12px;
`;

const TopRow = styled.div`
  margin-bottom: 8px;
`;