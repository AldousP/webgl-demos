import { mat4 } from "gl-matrix";
import Shader from '@app/types/shader';
import Entity from '@app/types/entity';

/**
 * Compiles and links shader data.
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
      uniform.location = gl.getUniformLocation( program, 'u_' + uniform.name ) ;
    });

    shader.indexBuffer = gl.createBuffer();
    shader.program = program;
  }
};

const setShaderData = ( gl: WebGLRenderingContext, shader: Shader, entity: Entity, transform: mat4 ) => {
  let attributes = shader.attributes as any;
  let uniforms = shader.uniforms as any;
  gl.uniformMatrix4fv(
    uniforms.transform.location,
    false,
    transform
  );

  {
    // Indicates the number of values in each element in the buffer
    // 3D positions will have 3 components each.
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;

    gl.bindBuffer( gl.ARRAY_BUFFER, attributes.position.buffer );
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array( entity.mesh.modelData.vertices ),
      gl.STATIC_DRAW
    );
    gl.vertexAttribPointer(
      attributes.position.location,
      numComponents,
      type,
      normalize,
      stride,
      offset
    );
    gl.enableVertexAttribArray( attributes.position.location );
  }

  {
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, shader.indexBuffer );
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array( entity.mesh.modelData.indices ),
      gl.STATIC_DRAW
    );
  }
};

export { setShaderData, initializeShader }