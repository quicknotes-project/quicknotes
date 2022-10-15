import { cn } from '../../utils';
import { Classable, HasCoords, Nestable } from '../../types';
import './ContextMenu.css'

interface ContextMenuProps extends HasCoords, Nestable, Classable {}

export function ContextMenu({ x, y, className, children }: ContextMenuProps) {
  return <div className={cn('contextMenu', className)}>{children}</div>;
}
