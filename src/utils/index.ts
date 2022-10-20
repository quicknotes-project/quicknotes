import classNames from "classnames";
import { makeFailed, makeSuccessful, Optional } from "./Optional";

export const cn = classNames

export function getRandom(max: number): number;
export function getRandom(min: number, max?: number): number;
export function getRandom(first: number, second?: number): number {
  const [min, max] = second ? [first, second] : [0, first];
  return min + (max - min) * Math.random();
}

export function generateRandomColor(): string {
  const h = getRandom(360)
  const s = getRandom(1)
  const v = getRandom(0.25, 1)

  const c = v * s
  const h_ = h / 60
  const x = c * (1 - Math.abs(Math.floor(h_) % 2 - 1))
  const m = v - c

  const rgb_ = (() => {
    switch (true) {
      case h_ < 1: return [c, x, 0]
      case h_ < 2: return [x, c, 0]
      case h_ < 3: return [0, c, x]
      case h_ < 4: return [0, x, c]
      case h_ < 5: return [x, 0, c]
      default: return [c, 0, x]
    }
  })()

  return rgb_
    .map((value_) => (Math.round((value_ + m) * 255))
      .toString(16)
      .padStart(2, '0'))
    .join('')
    .replace(/^/, '#')
}

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function formatDate(date?: Date): string | null {
  return date ? `${date.getDate()} ${monthNames[date.getMonth()].substring(0, 3)}, ${date.getFullYear()}` : null
}

export function renderIf(condition: boolean, element: JSX.Element): JSX.Element | undefined
export function renderIf(condition: boolean, elementIfTrue: JSX.Element, elementIfFalse: JSX.Element): JSX.Element
export function renderIf(condition: boolean, elementIfTrue: JSX.Element, elementIfFalse?: JSX.Element): JSX.Element | undefined {
  return condition ? elementIfTrue : elementIfFalse
}

export function isString(value: any): value is string {
  return typeof value === 'string'
}

export function safeJSONParse<T>(guard: (value: any) => value is T): (text: string) => Optional<T> {
  return (text: string) => {
    try {
      const parsed = JSON.parse(text)
      if (!guard(parsed)) return makeFailed("bad format")
      return makeSuccessful(parsed)
    } catch (error) {
      return makeFailed("bad format")
    }
  }
}