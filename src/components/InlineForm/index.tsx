import { useEffect, useRef, useState } from 'react';
import { cn } from '../../utils';
import {
  Changeable,
  Classable,
  Focusable,
  HasValue,
  IDable,
  KeyAware,
  Nameable,
  Styleable,
  Submittable,
} from '../../types';
import './InlineForm.css';

interface InlineFormProps
  extends HasValue<string>,
    IDable,
    Nameable,
    Classable,
    Styleable,
    KeyAware<HTMLInputElement>,
    Changeable<HTMLInputElement>,
    Submittable<HTMLFormElement>,
    Focusable<HTMLInputElement> {
  placeholder?: string;
}

export default function InlineForm({
  id,
  name,
  value,
  onBlur,
  onKeyDown,
  onChange,
  onSubmit,
  className,
  placeholder,
  style,
}: InlineFormProps) {
  const [width, setWidth] = useState(0);
  const span = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!span.current) return;
    setWidth(span.current.offsetWidth);
  }, [value]);
  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        name={name}
        id={id || `inline-form-${name}`}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className={cn('input inline-form-input', className)}
        style={{
          width,
          ...style,
        }}
      />
      <input type="submit" hidden />
      <span
        ref={span}
        className={cn('input inline-form-input', className)}
        style={{ position: 'absolute', opacity: 0 }}
      >
        {value}
      </span>
    </form>
  );
}
