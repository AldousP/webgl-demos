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
    console.log( value );
    this.props.onChange( value );
  };

  render () {
    return (
      <ColorInputWrapper>
        <TopRow>
          <div> { this.props.name }</div>
          <HuePicker
            color={ this.props.value }
            onChangeComplete={ this.onChange }
          />
        </TopRow>
      </ColorInputWrapper>
    );
  }
}

const ColorInputWrapper = styled.div`
  border: thin solid black;
  margin-top: 2px;
  margin-bottom: 2px;
  padding: 4px;
`;

const TopRow = styled.div`
`;