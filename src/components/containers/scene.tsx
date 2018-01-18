import * as React from 'react';
import * as BezierEasing from 'bezier-easing';
import styled from 'styled-components';
import { mat4, vec3, vec4 } from 'gl-matrix';

import breakpoints from '@app/components/styled/breakpoints';
import EditorValueInput from "@app/components/UI/editor-value-input";
import { Sequencer, SequenceType } from '@app/util/sequencer';
import { degToRad, radToDeg, isPowerOf2, randRange } from '@app/util/math';

const window = require( 'window' );
const document = window.document;
window.mat4 = mat4;

export enum EditorValueInputType {
  TextInput,
  SliderInput,
  ToggleInput
}

export interface EditorValue {
  name: string;
  value: boolean | string | number;
  type: EditorValueInputType;
}

export class SliderValue implements EditorValue {
  type: EditorValueInputType;
  name: string;
  value: number;
  min: number;
  max: number;

  constructor ( name: string, value: number, min: number, max: number ) {
    this.name = name;
    this.value = value;
    this.min = min;
    this.max = max;
    this.type = EditorValueInputType.SliderInput;
  }
}


export class TextValue implements EditorValue {
  type: EditorValueInputType;
  name: string;
  value: string;
  max: number;

  constructor ( name: string, value: string, max: number ) {
    this.name = name;
    this.value = value;
    this.max = max;
    this.type = EditorValueInputType.TextInput;
  }
}

export class ToggleValue implements EditorValue {
  type: EditorValueInputType.ToggleInput;
  name: string;
  value: boolean;
}

export type Props = {

}

export type State = {
  name: string
  toolpaneOpen: boolean,
  canvas_w: number,
  canvas_h: number,
  editorValues: Array<EditorValue>,
  paused: boolean
}


export default class Scene extends React.Component<Props, State> {
  vertShader: string = require( '@app/GLSL/vertex/scene_5.glsl' );
  fragShader: string = require( '@app/GLSL/fragment/scene_5.glsl' );

  constructor ( props ) {
    super( props );
    this.state = {
      name: '',
      toolpaneOpen: true,
      canvas_w: 640,
      canvas_h: 360,
      editorValues: [],
      paused: false
    }
  }

  componentDidMount () {
    let canvas: HTMLElement = document.getElementById( 'scene-gl-canvas' );
    window.requestAnimationFrame( this.mainLoop );
  }

  renderToolPane = () => {
    if ( this.state.toolpaneOpen ) {
      return (
        <Toolpane>
          {
            this.state.editorValues.map( ( value, i ) => {
              return (
                <EditorValueInput key={ i } data={ value } onChange={ e => {
                  console.log( e );
                }} />
              )
            } )
          }
        </Toolpane>
      )
    }
  };

  mainLoop = () => {
    window.requestAnimationFrame( this.mainLoop );
  };

  render () {
    return (
      <SceneContainer >
        <Canvas id="scene-gl-canvas"
                width={ this.state.canvas_w }
                height={ this.state.canvas_h }
        />
        { this.renderToolPane() }
      </SceneContainer>
    ) }
}

const SceneContainer = styled.div`
  //border: thin solid white;
  display: grid;
  grid-template-columns: 75% 25%;
  justify-content: space-between;
  @media (max-width: ${ breakpoints.small }px) {
    grid-template-columns: 1fr;
    grid-template-rows: 65% 35%;
  }
`;

const Toolpane = styled.div`
  //border: thin solid salmon;
`;

const Canvas = styled.canvas`
   max-width: 100%;
   background-color: black;
   //border: thin solid cornflowerblue;
   @media (max-width: ${ breakpoints.small }px) {
    max-width: 95vw;
    max-height: 55vh;
  }
`;


