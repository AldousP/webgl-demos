import Shader from '@app/types/shader';

class DefaultShader extends Shader {
  vertexSource = require( '@app/GLSL/vertex/default.glsl' );
  fragmentSource = require( '@app/GLSL/fragment/default.glsl' );
  attributes = {
    position: {
      name: 'position',
      buffer: null,
      location: null
    }
  };

  uniforms = {
    transform: {
      name: 'transform',
      location: null
    }
  };

  constructor () {
    super();
  }
}

export default DefaultShader;
