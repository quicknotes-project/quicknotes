import { cn } from '../../utils';
import { Classable, Clickable } from '../../types';
import './EditButton.css';

interface EditButtonProps extends Clickable<HTMLButtonElement>, Classable {}

export default function EditButton({ onClick, className }: EditButtonProps) {
  return (
    <button className={cn('edit', className)} onClick={onClick}>
      🖉
    </button>
  );
}
