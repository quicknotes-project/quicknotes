import { Argument } from 'classnames';

export type ClassArgument = Argument

export interface Substitutable {
  as?: keyof HTMLElementTagNameMap;
}

export interface Nestable {
  children?: React.ReactNode;
}

export interface Nameable {
  name?: string;
}

export interface IDable {
  id?: string;
}

export interface Classable {
  className?: ClassArgument;
}

export interface Activatable {
  active?: boolean;
}

export interface Readonlyable {
  readonly?: boolean;
}

export interface Styleable {
  style?: React.CSSProperties;
}

export interface Clickable<T extends HTMLElement> {
  onClick?: React.MouseEventHandler<T>;
  onDoubleClick?: React.MouseEventHandler<T>;
  onContextMenu?: React.MouseEventHandler<HTMLTextAreaElement>;
}

export interface Changeable<T extends HTMLElement> {
  onChange?: React.ChangeEventHandler<T>;
}

export interface Submittable<T extends HTMLElement> {
  onSubmit?: React.FormEventHandler<T>
}

export interface HasValue<T> {
  value: T;
}

export interface HasCoords {
  x: number;
  y: number;
}

