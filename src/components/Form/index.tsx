import { cn } from '../../utils';
import {
  Changeable,
  Classable,
  HasValue,
  Hidable,
  IDable,
  Nameable,
  Placeholderable,
  Touchable,
  Validatable,
} from '../../types';
import './Form.css';

export default function Form() {
  return null;
}

export interface InputProps
  extends IDable,
    Nameable,
    Classable,
    HasValue<string>,
    Changeable<HTMLInputElement>,
    Placeholderable,
    Validatable,
    Touchable,
    Hidable {
  label: string;
  type?: React.HTMLInputTypeAttribute;
}

function InputGroup({
  label,
  id,
  name,
  type,
  value,
  onChange,
  className,
  placeholder,
  valid,
  validMessage,
  invalid,
  invalidMessage,
  touched,
  hidden,
}: InputProps) {
  return (
    <fieldset className={cn('input-group', { hidden }, className)}>
      <legend>{label}</legend>
      <input
        id={id}
        name={name}
        type={type || 'text'}
        value={value}
        onChange={onChange}
        className={cn({ valid: !!valid, invalid: !!invalid }, className)}
        placeholder={placeholder}
      />
      {touched && valid && <div className="valid-message">{validMessage}</div>}
      {touched && invalid && (
        <div className="invalid-message">{invalidMessage}</div>
      )}
    </fieldset>
  );
}

Form.InputGroup = InputGroup;
