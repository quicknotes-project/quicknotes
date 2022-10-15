import { cn } from '../../utils';
import {
  Changeable,
  Classable,
  HasValue,
  Nameable,
  Styleable,
  Submittable,
} from '../../types';
import './InlineForm.css'

interface InlineFormProps
  extends HasValue<string>,
    Changeable<HTMLInputElement>,
    Submittable<HTMLFormElement>,
    Nameable,
    Classable,
    Styleable {
  placeholder?: string;
}

export default function InlineForm({
  name,
  value,
  onChange,
  onSubmit,
  className,
  placeholder,
  style,
}: InlineFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        name={name}
        id={`inline-form-${name}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={cn('inline-form-input', className)}
        style={{
          width: `calc(2ch + ${value.length}ch)`,
          textAlign: 'center',
          ...style,
        }}
      />
    </form>
  );
}
