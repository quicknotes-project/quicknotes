import { Changeable, Classable, HasValue, Styleable } from '../types';
import { cn } from '../utils';

interface InlineFormProps
  extends HasValue<string>,
    Changeable<HTMLInputElement>,
    Classable,
    Styleable {
  name: string;
  placeholder?: string;
}

export default function InlineForm({
  name,
  value,
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
        id={`inline-form-${name}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: `calc(2ch + ${value.length}ch)`,
          textAlign: 'center',
          ...style,
        }}
        className={cn('inline-form-input', className)}
      />
    </form>
  );
}
