import { Argument as ClassArgument } from "classnames";

export type { ClassArgument };

export type IfEquals<X, Y, A = X, B = never> = (<T>() => T extends X
  ? 1
  : 2) extends <T>() => T extends Y ? 1 : 2
  ? A
  : B;

export type WritableKeys<T> = {
  [P in keyof T]-?: IfEquals<
    { [Q in P]: T[P] },
    { -readonly [Q in P]: T[P] },
    P
  >;
}[keyof T];

export type Maybe<T> = T | null;

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
  placeholder?: string;
}

export interface Focusable<T extends HTMLElement> {
  onFocus?: React.FocusEventHandler<T>;
  onBlur?: React.FocusEventHandler<T>;
}

export interface Validatable {
  valid?: boolean;
  invalid?: boolean;
  validMessage?: string;
  invalidMessage?: string;
}

export interface Clickable<T extends HTMLElement> {
  onClick?: React.MouseEventHandler<T>;
  onAuxClick?: React.MouseEventHandler<T>;
  onDoubleClick?: React.MouseEventHandler<T>;
  onContextMenu?: React.MouseEventHandler<T>;
}

export interface KeyAware<T extends HTMLElement> {
  onKeyDown?: React.KeyboardEventHandler<T>;
  onKeyDownCapture?: React.KeyboardEventHandler<T>;
  onKeyUp?: React.KeyboardEventHandler<T>;
  onKeyUpCapture?: React.KeyboardEventHandler<T>;
}

export interface HasValue<T> {
  value: T;
}

export interface Placeholderable {
  placeholder?: string;
}

export interface Changeable<T extends HTMLElement> {
  onChange?: React.ChangeEventHandler<T>;
}

export interface Submittable<T extends HTMLElement> {
  onSubmit?: React.FormEventHandler<T>;
}

export interface Inputtable<TValue, TElement extends HTMLElement>
  extends HasValue<TValue>,
    Changeable<TElement> {}

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
