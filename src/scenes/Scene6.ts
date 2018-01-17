import * as React from 'react';

import Scene, { connectScene } from '@app/components/containers/scene';

export type Props = {
  setEditorValues: Function
}

export type State = {

}

class Scene6 extends React.Component<Props, State> {

  constructor ( props ) {
    super ( props );
  }

  componentDidMount () {
    this.props.setEditorValues([
      {
        name: 'test'
      }
    ]);
  }

  render () {
    return '';
  }
}

export default connectScene( Scene6 );

