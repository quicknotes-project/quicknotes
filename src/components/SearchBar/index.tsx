import { Classable, Nestable } from '../../types';
import { cn } from '../../utils';
import './SearchBar.css';

interface SearchBarProps extends Classable, Nestable {}

export default function SearchBar({ className, children }: SearchBarProps) {
  return <div className={cn('search-bar', className)}>{children}</div>;
}
