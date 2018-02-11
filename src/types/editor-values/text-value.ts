import EditorValueInputType from '@app/types/editor-values/editor-value-type';
import EditorValue from '@app/types/editor-values/interface-editor-value';

class TextValue implements EditorValue {
  type: EditorValueInputType;
  name: string;
  value: string;
  max: number;

  constructor ( name: string, value: string, max: number ) {
    this.name = name;
    this.value = value;
    this.max = max;
    this.type = EditorValueInputType.TextInput;
  }
}

export default TextValue;