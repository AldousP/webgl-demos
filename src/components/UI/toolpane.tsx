import * as React from 'react';

import styled from 'styled-components';
import Scene from "@app/components/containers/scene";

export type Props = {

}

export type State = {


}

const Pane = styled.div`
  border: thin solid ${ props => props.theme.trimColor };
`
;

class ToolPane extends React.Component<Props, State> {
  constructor ( props ) {
    super( props );

  }

  render() {
    return (
      <Pane>
        Value Edit Pane
      </Pane>
    );
  }
}

export default ToolPane;