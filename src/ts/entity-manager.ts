import { Entity } from "./entity";
import { ComponentType } from "./component-type";

export default class EntityManager {
  entityMap: Map<string, Entity>;
  componentTypeMap: Map<ComponentType, string>;
}