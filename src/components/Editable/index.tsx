import React from 'react';
import InlineForm from '../InlineForm';
import {
  Changeable,
  Classable,
  Clickable,
  HasValue,
  Nameable,
  Styleable,
  Submittable,
  Substitutable,
} from '../../types';
import './Editable.css';
import { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';

interface EditableProps
  extends Classable,
    Substitutable,
    HasValue<string>,
    Changeable<HTMLInputElement>,
  Clickable<HTMLDivElement>,
    Styleable,
    Nameable {}

export default function Editable({
  as,
  name,
  value,
  onChange,
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
      onClick={() => {
        if (editable) return;
        setEditable((state) => !state);
      }}
    >
      {editable ? (
        <InlineForm
          id={`editable-input-${name}`}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={() => setEditable(false)}
          className={className}
          style={style}
        />
      ) : (
        React.createElement(as || 'div', { className, style }, value)
      )}
    </div>
  );
}
