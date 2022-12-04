import { EditText, EditTextProps } from 'react-edit-text';

export interface EditableTextProps extends EditTextProps {}

export type { onSaveProps as OnSaveProps } from 'react-edit-text';

export default function EditableText(props: EditableTextProps) {
  return <EditText {...props} />;
}
