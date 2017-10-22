import { mat4 } from 'gl-matrix/src/gl-matrix';
import Component from "./component";

/**
 * Entities are containers for {@link Component} definitions.
 * Each entity has an ID that is unique to the scene and runtime.
 */
export class Entity {
  ID: number;
  name: string;
  mesh: Array<number>;
  transform: mat4 = mat4.create();
  components: Map<string, Component>;
}