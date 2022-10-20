import React, { useState, useRef, useEffect } from 'react';
import InlineForm from '../InlineForm';
import { cn, renderIf } from '../../utils';
import {
  Changeable,
  Classable,
  Clickable,
  HasValue,
  Placeholderable,
  Styleable,
  Substitutable,
} from '../../types';
import './Editable.css';

interface EditableProps
  extends Classable,
    Substitutable,
    Placeholderable,
    HasValue<string>,
    Changeable<HTMLInputElement>,
    Clickable<HTMLDivElement>,
    Styleable {}

export default function Editable({
  as,
  value,
  onChange,
  placeholder,
  className,
  style,
}: EditableProps) {
  const [editable, setEditable] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (editable) {
      wrapperRef.current?.getElementsByTagName('input').item(0)?.focus();
    }
  }, [editable]);
  return (
    <div
      ref={wrapperRef}
      className="editable-wrapper"
      onClick={() => {
        if (editable) return;
        setEditable((state) => !state);
      }}
    >
      {renderIf(
        editable,
        <InlineForm
          value={value}
          onChange={onChange}
          onSubmit={(e) => {
            e.preventDefault();
            setEditable(false);
          }}
          onBlur={() => setEditable(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setEditable(false);
            }
          }}
          className={cn(className, 'editable-input')}
          style={style}
        />,
        React.createElement(
          as || 'div',
          {
            className: cn(className, 'editable', { placeholder: value === '' }),
            style,
          },
          value || placeholder
        )
      )}
    </div>
  );
}
