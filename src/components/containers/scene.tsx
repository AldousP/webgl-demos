import * as React from 'react';
import * as BezierEasing from 'bezier-easing';
import styled from 'styled-components';
import { mat4, vec3, vec4 } from 'gl-matrix';

import breakpoints from '@app/components/styled/breakpoints';
import EditorValueInput from "@app/components/UI/editor-value-input";
import { Sequencer, SequenceType } from '@app/types/sequencer';
import { degToRad, radToDeg, isPowerOf2, randRange } from '@app/util/math';
import EditorValue from '@app/types/editor-values/interface-editor-value';
import DefaultShader from '@app/shader-wrappers/default';
import Camera from '@app/types/camera';
import Shader from '@app/types/shader';
import ObjMesh from '@app/types/obj-mesh';
import { initializeShader, setShaderData } from '@app/util/gl';
import Entity from '@app/types/entity';

const window = require( 'window' );
const document = window.document;
window.mat4 = mat4;

export interface SceneProps {
  parentProp?: boolean
}

export type State = {
  name: string
  toolpaneOpen: boolean,
  canvas_w: number,
  canvas_h: number,
  editorValues: Array<EditorValue>,
  paused: boolean
}

export interface RenderableScene {
  updateScene: ( delta: number ) => void;
}

export default abstract class Scene<P> extends React.Component<P, State> implements RenderableScene {
  delta: number;
  last: number;
  gl: WebGLRenderingContext;
  shader: Shader;
  sequencers: Array<Sequencer>;
  camera: Camera;
  transform: mat4;
  shaderTransform: mat4;
  shaders: {
    defaultShader: DefaultShader
  };

  entities: Array<Entity>;

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

    this.camera = new Camera();
    this.last = new Date().getTime();
    this.shaders = {
      defaultShader: new DefaultShader()
    };
  }

  componentDidMount () {
    let canvas: HTMLCanvasElement = document.getElementById( 'scene-gl-canvas' );
    this.gl = canvas.getContext( 'webgl' );
    let { gl } = this;
    initializeShader( this.shaders.defaultShader, gl );
    this.transform = mat4.create();
    this.shaderTransform = mat4.create();
    window.requestAnimationFrame( this.mainLoop );
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

  public updateScene = ( delta: number ) => {

  };

  renderScene = ( delta: number, gl: WebGLRenderingContext ) => {
    gl.viewport( 0, 0, gl.canvas.width, gl.canvas.height );
    gl.clearColor(
      0,
      0,
      0,
      1
    );

    gl.clearDepth( 1.0 );                 // Clear everything
    gl.enable( gl.DEPTH_TEST );           // Enable depth testing
    gl.depthFunc( gl.LEQUAL) ;            // Near things obscure far things
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
    gl.useProgram( this.shaders.defaultShader.program );
    const { defaultShader } = this.shaders;

    this.entities.forEach( entity => {
      mat4.identity( this.shaderTransform );
      mat4.mul( this.shaderTransform, this.transform, entity.transform );
      setShaderData( gl, defaultShader, entity, this.shaderTransform );
      {
        const vertexCount = entity.mesh.modelData.indices.length;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(
          gl.LINE_LOOP,
          vertexCount,
          type,
          offset
        );
      }
    } );
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
                <EditorValueInput key={ i }
                                  data={ value }
                                  value={ 0 }
                                  onChange={ ( newVal: any ) => {

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
  margin: auto;
  margin-top: 32px;
  justify-content: space-between;
  @media (max-width: ${ breakpoints.small }px) {
    grid-template-columns: 1fr;
    grid-template-rows: 65% 35%;
  }
`;

const Toolpane = styled.div`
`;

const Canvas = styled.canvas`
   background-color: black;
   box-shadow: rgba(89,89,89,0.49) 0 0 3px;
   @media (max-width: ${ breakpoints.small }px) {
    max-width: 84vw;
  }
`;


