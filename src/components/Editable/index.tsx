import React from 'react';
import InlineForm from '../InlineForm';
import {
  Changeable,
  Classable,
  HasValue,
  Nameable,
  Submittable,
  Substitutable,
} from '../../types';
import './Editable.css'

interface EditableProps
  extends Classable,
    Substitutable,
    HasValue<string>,
    Changeable<HTMLInputElement>,
    Submittable<HTMLFormElement>,
    Nameable {
  editable: boolean;
}

export default function Editable({
  editable,
  value,
  onChange,
  onSubmit,
  name,
  className,
  as,
}: EditableProps) {
  return editable ? (
    <InlineForm
      name={name}
      value={value}
      onChange={onChange}
      className={className}
      onSubmit={onSubmit}
    />
  ) : (
    React.createElement(as || 'div', { className }, value)
  );
}
