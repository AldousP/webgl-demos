import { mat4 } from "gl-matrix";
import ObjMesh from '@app/types/obj-mesh';

export default class Entity {
  transform: mat4;
  mesh: ObjMesh;
}
