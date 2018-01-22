import Scene, {
  EditorValue, EditorValueInputType, SceneProps, SliderValue,
  TextValue
} from '@app/components/containers/scene';


export interface Props extends SceneProps {

}

class Scene6 extends Scene<Props> {
  constructor ( props ) {
    super ( props );
  }

  componentDidMount () {
    super.componentDidMount();

    this.setState({
      editorValues: [
        new SliderValue( 'X', 0, 0, 10 ),
        new SliderValue( 'Y', 0, 0, 10 ),
        new SliderValue( 'Z', 0, 0, 10 ),
        new TextValue( 'Name', 'test', 10 )
      ]
    })
  }
}

export default Scene6;

