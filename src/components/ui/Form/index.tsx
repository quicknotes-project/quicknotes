import { cn } from "../../../utils";
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
} from "../../../types";

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
  disabled?: boolean;
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
  disabled,
}: InputProps) {
  return (
    <div className={cn({ hidden }, className)}>
      <label htmlFor={id || name || label}>{label}</label>
      <input
        id={id || name || label}
        name={name || label}
        type={type || "text"}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={cn(
          "input",
          { valid: !!valid, invalid: !!invalid },
          className
        )}
        placeholder={placeholder}
      />
      {touched && valid && <div className="valid-message">{validMessage}</div>}
      {touched && invalid && (
        <div className="invalid-message">{invalidMessage}</div>
      )}
    </div>
  );
}

Form.InputGroup = InputGroup;
