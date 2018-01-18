import Scene, { EditorValue, EditorValueInputType, SliderValue, TextValue } from '@app/components/containers/scene';

class Scene6 extends Scene {
  constructor ( props ) {
    super ( props );
  }

  componentDidMount () {
    this.setState({
      editorValues: [
        new SliderValue( 'X', 0, 0, 10 ),
        new SliderValue( 'Y', 0, 0, 10 ),
        new SliderValue( 'Z', 0, 0, 10 ),
        new TextValue( 'Z', 'test', 10 )
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

