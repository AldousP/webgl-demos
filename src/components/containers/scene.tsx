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

class Camera {
  position: vec4;
  projection: mat4;
  fieldOfView: number;
  near: number;
  far: number;
  aspect: number;
}

abstract class Shader {
  vertexSource: string;
  fragmentSource: string;
  program: WebGLShader;
  uniforms: Object;
  attributes: Object;
  loaded: boolean;
  indexBuffer: WebGLBuffer;
}

class DefaultShader extends Shader {
  vertexSource = require( '@app/GLSL/vertex/default.glsl' );
  fragmentSource = require( '@app/GLSL/fragment/default.glsl' );
  attributes = {
    position: {
      name: 'position'
    }
  };

  uniforms = {
    combinedMatrix: mat4
  };

  constructor () {
    super();
  }
}

class ObjMesh {
  modelData: {
    has_materials: boolean;
    materials: Object;
    vertices: Array<number>;
    vertexNormals: Array<number>;
    textures: Array<Object>;
    indices: Array<number>;
    name: string;
    vertexMaterialIndices: Array<number>
    materialNames: Array<string>;
    materialIndices: Object;
    materialsByIndex: Object;
  }
}

class Entity {
  mesh: ObjMesh;
}

const sampleEntity: Entity = {
  mesh: {
    modelData: require( 'static/models/cube.obj' ).default
  }
};

const position = ( entity ): vec4 => {
  return entity.mesh.modelData.vertices;
};

const defaultShaderContext = {
  position
};

const bindShaderData = ( shader: Shader, shaderContext: Object, entity: Entity, gl: WebGLRenderingContext) => {
  const components = 4;
  const type = gl.FLOAT;
  const normalize = false;
  const stride = 0;
  const offset = 0;
  let { attributes, uniforms } = shader;

  Object.keys( attributes ).map( key => {
    let { buffer, location } = attributes[ key ];
    gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array( shaderContext[ key ]( entity ) ),
      gl.STATIC_DRAW
    );
    gl.vertexAttribPointer(
      location,
      components,
      type,
      normalize,
      stride,
      offset
    );

    gl.enableVertexAttribArray( location );
  } );
};

/**
 * Loads the source URLS on the provided shader, compiles and links them.
 * @param {Shader} shader
 * @param {WebGLRenderingContext} gl
 */
const initializeShader = ( shader: Shader, gl: WebGLRenderingContext ) => {
  const buildShader = ( type: number, source: string, gl: WebGLRenderingContext ): WebGLShader => {
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

  let program: WebGLProgram = gl.createProgram();
  gl.attachShader( program, buildShader( gl.VERTEX_SHADER, shader.vertexSource, gl ) );
  gl.attachShader( program, buildShader( gl.FRAGMENT_SHADER, shader.fragmentSource, gl ) );
  gl.linkProgram( program );

  let success = gl.getProgramParameter( program, gl.LINK_STATUS );
  if ( success ) {
    shader.loaded = true;
    Object.keys( shader.attributes ).map( key => {
      let attribute = shader.attributes[ key ];
      attribute.location = gl.getAttribLocation( program, 'a_' + attribute.name ) ;
      attribute.buffer = gl.createBuffer();
    });

    Object.keys( shader.uniforms ).map( key => {
      let uniform = shader.uniforms[ key ];
      uniform.location = gl.getAttribLocation( program, 'u_' + uniform.name ) ;
    });

    shader.indexBuffer = gl.createBuffer();
    shader.program = program;
  }
};

export default class Scene<P> extends React.Component<P, State> {
  delta: number;
  last: number;
  gl: WebGLRenderingContext;
  shader: Shader;
  sequencers: Array<Sequencer>;
  camera: Camera;
  shaders: {
    defaultShader: DefaultShader
  };

  entities: Array<Entity>;
  indiciesBuffer: WebGLBuffer;

  constructor ( props ) {
    super(props);
    this.state = {
      name: '',
      toolpaneOpen: true,
      canvas_w: 640,
      canvas_h: 360,
      editorValues: [],
      paused: false,
    };

    this.camera = new Camera();
    this.last = new Date().getTime();
    this.shaders = {
      defaultShader: new DefaultShader()
    };

    this.entities = [
      sampleEntity
    ];
  }

  componentDidMount () {
    let canvas: HTMLCanvasElement = document.getElementById( 'scene-gl-canvas' );
    this.gl = canvas.getContext( 'webgl' );
    let { gl } = this;

    initializeShader( this.shaders.defaultShader, gl );
    // bindShaderData( this.shaders.defaultShader, defaultShaderContext, sampleEntity, gl );

    console.log( sampleEntity.mesh.modelData.indices );



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
    // window.requestAnimationFrame( this.mainLoop );
  };

  updateScene = ( delta: number ) => {

  };

  renderScene = ( delta: number, gl: WebGLRenderingContext ) => {
    gl.viewport( 0, 0, gl.canvas.width, gl.canvas.height );
    gl.clearColor( 0.1, 0.15, 0.25, 1.0 );  // Clear to black, fully opaque
    gl.clearDepth( 1.0 );                 // Clear everything
    gl.enable( gl.DEPTH_TEST );           // Enable depth testing
    gl.depthFunc( gl.LEQUAL) ;            // Near things obscure far things
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
    gl.useProgram( this.shaders.defaultShader.program );

    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.shaders.defaultShader.indexBuffer );
    gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array( sampleEntity.mesh.modelData.indices ), gl.STATIC_DRAW);

    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.shaders.defaultShader.indexBuffer );
    gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array( sampleEntity.mesh.modelData.indices ), gl.STATIC_DRAW);


    // this.entities.forEach( entity  =>  {
    //   {
    //     const vertexCount = entity.mesh.modelData.vertices.length / 4;
    //     const offset = 0;
    //     gl.drawArrays( gl.LINE_LOOP, offset, vertexCount );
    //   }
    // });
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
   border-radius: 5px;
   box-shadow: rgba(89,89,89,0.49) 0 0 3px;
   @media (max-width: ${ breakpoints.small }px) {
    max-width: 95vw;
    max-height: 55vh;
  }
`;


