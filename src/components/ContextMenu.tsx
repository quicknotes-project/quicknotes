import { Classable, HasCoords, Nestable } from '../types';
import { cn } from '../utils';

interface ContextMenuProps extends HasCoords, Nestable, Classable {}

export function ContextMenu({ x, y, className, children }: ContextMenuProps) {
  return <div className={cn('contextMenu', className)}>{children}</div>;
}
