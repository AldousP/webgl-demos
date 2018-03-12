export default class ObjMesh {
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
