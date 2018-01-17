export enum MeshType {
  TRIANGLES,
  TRIANGLES_STRIP,
  TRIANGLES_FAN,
}

export enum VertexLength {
  TWO,
  THREE
}

export class Mesh {
  data: Array<number>;
  meshType: MeshType;
  vertexLength: VertexLength;
}

