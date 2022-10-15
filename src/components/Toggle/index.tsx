import { cn } from '../../utils';
import { Activatable, Classable, Clickable } from '../../types';
import './Toggle.css'

interface ToggleProps
  extends Classable,
    Clickable<HTMLButtonElement>,
    Activatable {
  label: string;
  labelAlt?: string;
}

export default function Toggle({
  label: labelInactive,
  labelAlt: labelActive,
  active,
  className,
  onClick,
}: ToggleProps) {
  return (
    <button className={cn('edit', { active }, className)} onClick={onClick}>
      {active ? labelActive ?? labelInactive : labelInactive}
    </button>
  );
}
