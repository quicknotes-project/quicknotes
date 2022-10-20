import { cn } from '../../utils';
import {
  Changeable,
  Classable,
  Focusable,
  HasValue,
  IDable,
  Nameable,
  Styleable,
} from '../../types';
import './InlineForm.css';

interface InlineFormProps
  extends HasValue<string>,
    IDable,
    Changeable<HTMLInputElement>,
    Focusable<HTMLInputElement>,
    Nameable,
    Classable,
    Styleable {
  placeholder?: string;
}

export default function InlineForm({
  id,
  name,
  value,
  onBlur,
  onChange,
  className,
  placeholder,
  style,
}: InlineFormProps) {
  return (
    <form>
      <input
        type="text"
        name={name}
        id={id || `inline-form-${name}`}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className={cn('input inline-form-input', className)}
        style={{
          width: `calc(${value.length}ch)`,
          ...style,
        }}
      />
      <input type="submit" hidden />
    </form>
  );
}
