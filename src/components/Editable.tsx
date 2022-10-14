import React, { useEffect, useRef } from 'react';
import { cn } from '../utils';
import { Changeable, Classable, HasValue, Substitutable } from '../types';
import InlineForm from './InlineForm';

interface EditableProps
  extends Classable,
    Substitutable,
    HasValue<string>,
    Changeable<HTMLInputElement> {
  name: string;
  editable: boolean;
}

export default function Editable({
  editable,
  as,
  value,
  onChange,
  name,
  className,
}: EditableProps) {
  useEffect(() => {});

  return editable ? (
    <InlineForm
      name={name}
      value={value}
      onChange={onChange}
      className={className}
    />
  ) : (
    React.createElement(as, { className }, value)
  );
}
