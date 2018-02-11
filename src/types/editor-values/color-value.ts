import EditorValueInputType from '@app/types/editor-values/editor-value-type';
import EditorValue from '@app/types/editor-values/interface-editor-value';
import Color from '@app/types/color';

class ColorValue implements EditorValue {
  type: EditorValueInputType;
  name: string;
  value: string | Color;

  constructor ( name: string, value: string | Color ) {
    this.name = name;
    this.value = value;
    this.type = EditorValueInputType.ColorInput;
  }
}

export default ColorValue;