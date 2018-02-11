import EditorValueInputType from '@app/types/editor-values/editor-value-type';
import EditorValue from '@app/types/editor-values/interface-editor-value';

class SliderValue implements EditorValue {
  type: EditorValueInputType;
  name: string;
  value: number;
  min: number;
  max: number;
  increment: number;

  constructor ( name: string, value: number, min: number, max: number, incr?: number ) {
    this.name = name;
    this.value = value;
    this.min = min;
    this.max = max;
    this.increment = incr ? incr : .1;
    this.type = EditorValueInputType.SliderInput;
  }
}

export default SliderValue;