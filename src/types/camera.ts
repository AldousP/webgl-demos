import { mat4, vec4 } from "gl-matrix";

class Camera {
  position: vec4;
  projection: mat4;
  fieldOfView: number;
  near: number;
  far: number;
  aspect: number;
}

export default Camera;