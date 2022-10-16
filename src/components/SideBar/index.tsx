import { cn } from '../../utils';
import { Classable, Clickable, HasValue, Nestable } from '../../types';
import './SideBar.css';
import classNames from 'classnames';

interface SideBarProps extends Nestable {}

export default function SideBar({ children }: SideBarProps) {
  return <div className="side-bar">{children}</div>;
}

interface HeaderProps
  extends HasValue<string>,
    Clickable<HTMLDivElement>,
    Classable {}

function Header({ value, className, onClick }: HeaderProps) {
  return (
    <div className={cn('side-bar-header-wrapper', className)} onClick={onClick}>
      <h3 className={cn('side-bar-header', className)}>{value}</h3>
    </div>
  );
}

SideBar.Header = Header;

interface ListProps extends Nestable, Classable {}

function List({ className, children }: ListProps) {
  return <ul className={cn('list', className)}>{children}</ul>;
}

interface ItemProps
  extends Clickable<HTMLLIElement>,
    HasValue<string>,
    Classable {}

function Item({ value, onClick, onAuxClick, className }: ItemProps) {
  return (
    <li onClick={onClick} onAuxClick={onAuxClick} className={cn('list-item', className)}>
      {value}
    </li>
  );
}

List.Item = Item

SideBar.List = List;
