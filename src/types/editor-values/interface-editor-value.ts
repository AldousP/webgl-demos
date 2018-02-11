import EditorValueInputType from '@app/types/editor-values/editor-value-type';

interface EditorValue {
  name: string;
  value: any;
  type: EditorValueInputType;
}

export default EditorValue;