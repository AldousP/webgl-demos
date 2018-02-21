import Scene, { SceneProps } from '@app/components/containers/scene';
import ColorValue from '@app/types/editor-values/color-value';
import SliderValue from '@app/types/editor-values/slider-value';
import { SelectValue } from '@app/types/editor-values/select-value';
import { mat4 } from "gl-matrix";
import Entity from '@app/types/entity';

export interface Props extends SceneProps {

}


const sphereEntity: Entity = {
  transform: mat4.create(),
  mesh: {
    modelData: require( 'static/models/icosphere.obj' ).default
  }
};

const cubeEntity: Entity = {
  transform: mat4.create(),
  mesh: {
    modelData: require( 'static/models/cube.obj' ).default
  }
};

mat4.translate(
  cubeEntity.transform,     // destination matrix
  cubeEntity.transform,     // matrix to translate
  [
    0,
    0,
    0
  ]
);


class Scene6 extends Scene<Props> {
  constructor ( props ) {
    super ( props );
    this.entities = [
      cubeEntity,
      // sphereEntity
    ];

  }

  componentDidMount () {
    super.componentDidMount();

    // this.setState({
    //   editorValues: [
    //     new ColorValue( 'Background', {
    //       r: 0.1,
    //       g: 0.15,
    //       b: 0.25,
    //       a: 1.0
    //     } ),
    //     new SliderValue( 'RotX', 0, -Math.PI, Math.PI ),
    //     new SliderValue( 'RotY', 0, -Math.PI, Math.PI ),
    //     new SliderValue( 'RotZ', 0, -Math.PI, Math.PI ),
    //     new SliderValue( 'CamX', 0, -64, 64, 0.25),
    //     new SliderValue( 'CamY', 0, -64, 64, 0.25),
    //     new SliderValue( 'CamZ', 0, -64, 64, 0.25),
    //     new SliderValue( 'Aspect', 1, .25, 3, .15 ),
    //     new SliderValue( 'FOV', 48, 16, 128 ),
    //     new SelectValue<number>( 'Draw_Type', 3, [
    //       {
    //         name: 'Lines',
    //         value: 1
    //       },
    //       {
    //         name: 'Line Loop',
    //         value: 2
    //       },
    //       {
    //         name: 'Line Strip',
    //         value: 3
    //       },
    //       {
    //         name: 'Triangles',
    //         value: 4
    //       },
    //       {
    //         name: 'Triangle Strip',
    //         value: 5
    //       },
    //       {
    //         name: 'Triangle Fan',
    //         value: 6
    //       }
    //
    //     ] )
    //   ]
    // })
  }

  updateScene = ( delta: number ) => {
    // let { FOV, CamX, CamY, CamZ, RotX, RotY, RotZ , Aspect} = this.state.editorData;
    const fieldOfView = 120 * Math.PI / 180;
    const aspect = 1.45;
    const zNear = 0.1;
    const zFar = 100.0;

    mat4.perspective(
      this.transform,
      fieldOfView,
      aspect,
      zNear,
      zFar
    );

    // mat4.translate(
    //   this.transform,     // destination matrix
    //   this.transform,     // matrix to translate
    //   [
    //     CamX,
    //     -CamY,
    //     -CamZ
    //   ]
    // );

    // mat4.rotateX( cubeEntity.transform, cubeEntity.transform, Math.PI / 6 * delta );
    // mat4.rotateX( sphereEntity.transform, sphereEntity.transform, Math.PI / 16 * delta );
    // mat4.rotateY( sphereEntity.transform, sphereEntity.transform, Math.PI / 16 * delta );
    // mat4.rotateZ( sphereEntity.transform, sphereEntity.transform, Math.PI / 16 * delta );
  };
}
export default Scene6;

