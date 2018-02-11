import EditorValueInputType from '@app/types/editor-values/editor-value-type';
import EditorValue from '@app/types/editor-values/interface-editor-value';

class ToggleValue implements EditorValue {
  type: EditorValueInputType.ToggleInput;
  name: string;
  value: boolean;
}

export default ToggleValue;