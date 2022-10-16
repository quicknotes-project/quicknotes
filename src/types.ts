import { Argument as ClassArgument } from 'classnames';

export type Maybe<T> = T | null

export type { ClassArgument }

export interface Substitutable {
  as?: keyof HTMLElementTagNameMap;
}

export interface Nestable {
  children?: React.ReactNode;
}

export interface StrictNestable {
  children: React.ReactElement;
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

export interface Placeholderable {
  placeholder?: string
}

export interface Validatable {
  valid?: boolean;
  invalid?: boolean;
  validMessage?: string;
  invalidMessage?: string;
}

export interface Clickable<T extends HTMLElement> {
  onClick?: React.MouseEventHandler<T>;
  onAuxClick?: React.MouseEventHandler<HTMLLIElement>
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

export interface Touchable {
  touched?: boolean;
}

export interface Hidable {
  hidden?: boolean;
}
