import { mat4 } from "gl-matrix";
import { Entity } from "./entity";

const ComponentTypes = {
  transform: 'transform',
  mesh: 'mesh'
};

class ComponentType {
  constructor (private type: string, private version: string) {};
}

/**
 * Components are maps of data contained by an { @link Entity }
 */
abstract class Component {
  type: ComponentType;
  state: Object = {};
}

class TransformState {
  mat: mat4 = mat4.create();
}

class Transform extends Component {
  type = new ComponentType (ComponentTypes.transform, '1');
  state = new TransformState();
}

class MeshState {
  mesh: Array<number>;
  meshType: MeshType;
  vertexCount: VertexSize;
}

class Mesh extends Component {
  type = new ComponentType (ComponentTypes.mesh, '1');
  state = new MeshState();
}

let transformComponent = new Transform();
let entity = new Entity();


class EntityManager {
  componentMap: Map<string, Array<number>> = new Map();
  entityIDMap: Map<string, Entity> = new Map();
  entityCount: number;
  entityID: number;
}

export enum MeshType {
  TRIANGLES,
  TRIANGLES_STRIP,
  TRIANGLES_FAN,
}

export enum VertexSize {
  TWO,
  THREE
}


