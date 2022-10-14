import classNames from "classnames";

export function getRandomInt(max: number): number;
export function getRandomInt(min: number, max?: number): number;
export function getRandomInt(first: number, second?: number): number {
  const [min, max] = second ? [first, second] : [0, first];
  return Math.round(min + (max - min) * Math.random());
}

export function generateColor(): string {
  const color = Array.from(Array(3))
    .map(() => getRandomInt(128, 255)
      .toString(16))
    .join('');
  return `#${color}`;
}

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function formatDate(date?: Date): string | null {
  return date ? `${date.getDate()} ${monthNames[date.getMonth()].substring(0, 3)}, ${date.getFullYear()}` : null
}

export const cn = classNames
