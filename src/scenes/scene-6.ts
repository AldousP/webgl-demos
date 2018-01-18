import Scene, { EditorValue } from '@app/components/containers/scene';

class Scene6 extends Scene {
  constructor ( props ) {
    super ( props );
  }

  componentDidMount () {
    this.setState({
      editorValues: [
        {
          name: 'CamX',
          type: 'SLIDER',
          value: 0,
          config: {
            min: 0,
            max: 10,
            step: 0.1,
          }
        },
        {
          name: 'CamY',
          type: 'SLIDER',
          value: 0,
          config: {
            min: 0,
            max: 10,
            step: 0.1
          }
        },
        {
          name: 'CamZ',
          type: 'SLIDER',
          value: 0,
          config: {
            min: 0,
            max: 10,
            step: 0.1
          }
        }
      ]
    })
  }

  /**
   * Receive the elapsed time since the last frame.
   *
   * @param {number} delta
   */
  updateScene ( delta: number, glContext ) {

  }
}

export default Scene6;

