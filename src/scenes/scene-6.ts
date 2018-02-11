import Scene, { SceneProps } from '@app/components/containers/scene';
import ColorValue from '@app/types/editor-values/color-value';
import SliderValue from '@app/types/editor-values/slider-value';
import { SelectValue } from '@app/types/editor-values/select-value';

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
        new ColorValue( 'Background', {
          r: 0.1,
          g: 0.15,
          b: 0.25,
          a: 1.0
        } ),
        new SliderValue( 'CamX', 0, -64, 64, 0.25),
        new SliderValue( 'CamY', 0, -64, 64, 0.25),
        new SliderValue( 'CamZ', 0, -64, 64, 0.25),
        new SliderValue( 'RotX', 0, -Math.PI, Math.PI ),
        new SliderValue( 'RotY', 0, -Math.PI, Math.PI ),
        new SliderValue( 'RotZ', 0, -Math.PI, Math.PI ),
        new SliderValue( 'FOV', 48, 16, 128 ),
        new SelectValue<number>( 'Draw_Type', 3, [
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

