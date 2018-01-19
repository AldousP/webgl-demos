import * as React from 'react';
import * as BezierEasing from 'bezier-easing';
import styled from 'styled-components';
import { mat4, vec3, vec4 } from 'gl-matrix';

import breakpoints from '@app/components/styled/breakpoints';
import EditorValueInput from "@app/components/UI/editor-value-input";
import { Sequencer, SequenceType } from '@app/util/sequencer';
import { degToRad, radToDeg, isPowerOf2, randRange } from '@app/util/math';

let cube = require( 'static/models/cube.obj' ).default;

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

class Camera {
  projection: mat4;
  fieldOfView: number;
  near: number;
  far: number;
  aspect: number;
}

export default class Scene extends React.Component<Props, State> {
  delta: number;
  last: number;
  gl: WebGLRenderingContext;
  vertexShaderSource: string = require( '@app/GLSL/vertex/scene_5.glsl' );
  fragmentShaderSource: string = require( '@app/GLSL/fragment/scene_5.glsl' );
  shader: WebGLShader;
  sequencers: Array<Sequencer>;

  constructor ( props ) {
    super(props);
    this.state = {
      name: '',
      toolpaneOpen: true,
      canvas_w: 640,
      canvas_h: 360,
      editorValues: [],
      paused: false
    };

    this.last = new Date().getTime();
  }

  buildShader = ( type: number, source: string, gl: WebGLRenderingContext ): WebGLShader => {
    let shader: WebGLShader = gl.createShader( type );
    gl.shaderSource( shader, source );
    gl.compileShader( shader );
    let success = gl.getShaderParameter( shader, gl.COMPILE_STATUS );
    if ( success ){
      return shader
    }
    console.log( gl.getShaderInfoLog( shader ) );
    gl.deleteShader( shader );
  };

  componentDidMount () {
    let canvas: HTMLCanvasElement = document.getElementById( 'scene-gl-canvas' );
    this.gl = canvas.getContext( 'webgl' );
    window.requestAnimationFrame( this.mainLoop );
    let { gl } = this;
    let vertexShader = this.buildShader( gl.VERTEX_SHADER, this.vertexShaderSource, gl );
    let fragmentShader = this.buildShader( gl.FRAGMENT_SHADER, this.fragmentShaderSource, gl );
    let program = gl.createProgram();
    gl.attachShader( program, vertexShader );
    gl.attachShader( program, fragmentShader );
    gl.linkProgram( program );

    let success = gl.getProgramParameter( program, gl.LINK_STATUS );
    if ( success ) {
      this.shader = program;
    }
  }

  mainLoop = () => {
    let current = new Date().getTime();
    this.delta = (current - this.last) / 1000;
    this.last = current;

    if ( !this.state.paused ) {
      this.updateScene( this.delta );
    }

    this.renderScene( this.delta, this.gl );
    window.requestAnimationFrame( this.mainLoop );
  };

  updateScene = ( delta: number ) => {

  };

  renderScene = ( delta: number, gl: WebGLRenderingContext ) => {
    gl.viewport( 0, 0, gl.canvas.width, gl.canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );  // Clear to black, fully opaque
    gl.clearDepth( 1.0 );                 // Clear everything
    gl.enable( gl.DEPTH_TEST );           // Enable depth testing
    gl.depthFunc( gl.LEQUAL) ;            // Near things obscure far things
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
    gl.useProgram( this.shader );

    {
      const vertexCount = 36;
      const type = gl.UNSIGNED_SHORT;
      const offset = 0;
      gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }
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
    )
  }

  renderToolPane = () => {
    if ( this.state.toolpaneOpen ) {
      return (
        <Toolpane>
          {
            this.state.editorValues.map( ( value, i ) => {
              return (
                <EditorValueInput key={ i } data={ value } onChange={ newVal => {
                  this.setState({
                    editorValues: this.state.editorValues.map( val => {
                      return val.name === value.name ? newVal : val
                    })
                  })
                }} />
              ) // jsx
            } ) // map
          }
        </Toolpane>
      )
    }
  };
}

const SceneContainer = styled.div`
  display: grid;
  grid-template-columns: 75% 25%;
  justify-content: space-between;
  @media (max-width: ${ breakpoints.small }px) {
    grid-template-columns: 1fr;
    grid-template-rows: 65% 35%;
  }
`;

const Toolpane = styled.div`
`;

const Canvas = styled.canvas`
   max-width: 100%;
   background-color: black;
   @media (max-width: ${ breakpoints.small }px) {
    max-width: 95vw;
    max-height: 55vh;
  }
`;


