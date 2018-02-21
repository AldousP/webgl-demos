abstract class Shader {
  vertexSource: string;
  fragmentSource: string;
  program: WebGLShader;
  uniforms: Object;
  attributes: Object;
  loaded: boolean;
  indexBuffer: WebGLBuffer;
}

export default Shader;