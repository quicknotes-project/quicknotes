import { Clickable, HasValue, Nestable } from '../../types';
import './ToolBar.css';

export default function ToolBar({ children }: Nestable) {
  return <div className="tool-bar">{children}</div>;
}

function Controls({ children }: Nestable) {
  return <div className="tool-bar-controls">{children}</div>;
}

ToolBar.Controls = Controls;

function UserInfo({ children }: Nestable) {
  return <div className="user-info">{children}</div>;
}

interface UserNameProps extends Clickable<HTMLSpanElement>, HasValue<string> {}

function UserName({ value, onClick }: UserNameProps) {
  return (
    <span className="user-name" onClick={onClick}>
      {value}
    </span>
  );
}

UserInfo.UserName = UserName;

ToolBar.UserInfo = UserInfo;
