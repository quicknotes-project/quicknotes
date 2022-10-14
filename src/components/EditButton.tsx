import { Classable, Clickable } from '../types';
import { cn } from '../utils';

interface EditButtonProps extends Clickable<HTMLButtonElement>, Classable {}

export default function EditButton({ onClick, className }: EditButtonProps) {
  return (
    <button className={cn('edit', className)} onClick={onClick}>
      🖉
    </button>
  );
}
