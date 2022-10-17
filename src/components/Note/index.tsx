import { cn, formatDate } from '../../utils';
import {
  Changeable,
  Classable,
  Clickable,
  HasValue,
  IDable,
  Nameable,
  Nestable,
  Readonlyable,
  Styleable,
} from '../../types';
import './Note.css';

export default function Note({ children }: Nestable) {
  return <div className="note">{children}</div>;
}

interface HeaderProps extends Nestable, Clickable<HTMLDivElement> {}

function Header({ onDoubleClick, children }: HeaderProps) {
  return (
    <div className="note-header" onDoubleClick={onDoubleClick}>
      {children}
    </div>
  );
}

function Title({ children }: Nestable) {
  return <div className="note-title-wrapper">{children}</div>;
}

function Controls({ children }: Nestable) {
  return <div className="note-controls">{children}</div>;
}

Header.Title = Title;
Header.Controls = Controls;

Note.Header = Header;

function Meta({ children }: Nestable) {
  return <div className="note-meta">{children}</div>;
}

function Tags({ children }: Nestable) {
  return (
    <div className="note-tags-wrapper">
      <ul className="note-tags">{children}</ul>
    </div>
  );
}

interface DatesProps {
  createdAt?: Date;
  modifiedAt?: Date;
}

function Dates({ createdAt, modifiedAt }: DatesProps) {
  return (
    <div className="note-dates">
      <span className="note-date">created at {formatDate(createdAt)}</span>
      <span className="note-date">modified at {formatDate(modifiedAt)}</span>
    </div>
  );
}

Meta.Tags = Tags;
Meta.Dates = Dates;

Note.Meta = Meta;

interface ContentProps
  extends Nameable,
    IDable,
    HasValue<string>,
    Changeable<HTMLTextAreaElement>,
    Clickable<HTMLTextAreaElement>,
    Classable,
    Styleable,
    Readonlyable {}

function Content({
  name,
  id,
  value,
  style,
  className,
  readonly,
  onChange,
  onContextMenu,
}: ContentProps) {
  return (
    <div className="note-content-wrapper">
      <textarea
        id={id || 'note-content'}
        name={name || 'note-content'}
        value={value}
        spellCheck="false"
        style={style}
        className={cn('note-content', className)}
        readOnly={readonly}
        onChange={onChange}
        onContextMenu={onContextMenu}
      />
    </div>
  );
}

function Text({
  name,
  id,
  value,
  style,
  className,
  readonly,
  onChange,
  onContextMenu,
}: ContentProps) {
  <div className="note-text-wrapper">
    <textarea
      id={id}
      name={name}
      value={value}
      spellCheck="false"
      style={style}
      className={cn('note-text', className)}
      readOnly={readonly}
      onChange={onChange}
      onContextMenu={onContextMenu}
    />
  </div>;
}

function Whiteboard() {
  return <div className="note-whiteboard"></div>;
}

Content.Text = Text;
Content.Whiteboard = Whiteboard;

Note.Content = Content;
