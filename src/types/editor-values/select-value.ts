import EditorValueInputType from '@app/types/editor-values/editor-value-type';
import EditorValue from '@app/types/editor-values/interface-editor-value';

export type SelectOption<T> = {
  name: string,
  value: T
}

export class SelectValue<T> implements EditorValue {
  type: EditorValueInputType.SelectInput;
  name: string;
  value: T;
  options: SelectOption<T>[];

  constructor ( name: string, value: T, options: SelectOption<T>[] ) {
    this.name = name;
    this.value = value;
    this.options = options;
    this.type = EditorValueInputType.SelectInput;
  }
}