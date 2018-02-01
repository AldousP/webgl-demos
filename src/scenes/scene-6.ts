import Scene, {
  EditorValue, EditorValueInputType, SceneProps, SelectValue, SliderValue,
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
        new SliderValue( 'CamX', 0, -64, 64 ),
        new SliderValue( 'CamY', 0, -64, 64 ),
        new SliderValue( 'CamZ', 0, -64, 64 ),
        new SliderValue( 'RotX', 0, -Math.PI, Math.PI ),
        new SliderValue( 'RotY', 0, -Math.PI, Math.PI ),
        new SliderValue( 'RotZ', 0, -Math.PI, Math.PI ),
        new SelectValue<number>( 'Draw_Type', 1, [
          {
            name: 'Lines',
            value: 1
          },
          {
            name: 'Line Loop',
            value: 2
          },
          {
            name: 'Line Strip',
            value: 3
          },
          {
            name: 'Triangles',
            value: 4
          },
          {
            name: 'Triangle Strip',
            value: 5
          },
          {
            name: 'Triangle Fan',
            value: 6
          }

        ] )
      ]
    })
  }
}
export default Scene6;

