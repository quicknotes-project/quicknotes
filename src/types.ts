import { Argument } from 'classnames';

export type ClassArgument = Argument

export interface Substitutable {
  as: keyof HTMLElementTagNameMap;
}

export interface Nestable {
  children?: React.ReactNode;
}

export interface Classable {
  className?: ClassArgument;
}

export interface HasValue<T> {
  value: T;
}

export interface Clickable<T extends HTMLElement> {
  onClick: React.MouseEventHandler<T>;
}

export interface Changeable<T extends HTMLElement> {
  onChange: React.ChangeEventHandler<T>;
}

export interface HasCoords {
  x: number;
  y: number;
}

export interface Activatable {
  active: boolean;
}

export interface Styleable {
  style?: React.CSSProperties;
}