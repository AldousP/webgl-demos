import * as React from 'react';

import { Sequencer } from 'src/util/sequencer';

import Scene from '@app/components/containers/scene';

export type Props = {

}

export type State = {

}

export default class Scene6 extends Scene<Props, State> {

  constructor ( props ) {
    super ( props );

  }

  componentDidMount () {
    super.componentDidMount();
    this.setState( {
      name: 'Scene 6'
    })
  }
}

