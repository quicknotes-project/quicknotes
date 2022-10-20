import { useEffect, useRef, useState } from 'react';
import MDEditor, { ContextStore } from '@uiw/react-md-editor';
import rehypeSanitize from 'rehype-sanitize';
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
    <div className="note-header header" onDoubleClick={onDoubleClick}>
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

interface ContentProps extends Nestable, Classable {}

function Content({ className, children }: ContentProps) {
  return (
    <div
      className={cn('note-content', className)}
      // onClick={(e) => {
      //   const textareas = [
      //     ...e.currentTarget.querySelectorAll('textarea').values(),
      //   ];
      //   if (textareas.length === 0) return;
      //   const last = textareas[textareas.length - 1];
      //   last.setSelectionRange(last.value.length, last.value.length);
      //   last.focus();
      // }}
    >
      {children}
    </div>
  );
}

interface TextProps
  extends Nameable,
    IDable,
    HasValue<string>,
    Changeable<HTMLTextAreaElement>,
    Clickable<HTMLTextAreaElement>,
    Classable,
    Styleable,
    Readonlyable {}

function Text({
  name,
  id,
  value,
  style,
  className,
  readonly,
  onChange,
  onContextMenu,
}: TextProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = 'inherit';
    textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
  });
  return (
    <div className="note-text-wrapper">
      <textarea
        ref={textareaRef}
        id={id}
        name={name}
        value={value}
        spellCheck="false"
        style={style}
        className={cn('note-text', className)}
        readOnly={readonly}
        onChange={onChange}
        onContextMenu={onContextMenu}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

function Whiteboard() {
  return (
    <div className="note-whiteboard">
      <canvas onClick={(e) => e.stopPropagation()}></canvas>
    </div>
  );
}

interface MarkdownProps
  extends HasValue<string>,
    Clickable<HTMLDivElement>,
    Styleable {
  onChange?: (
    value?: string,
    event?: React.ChangeEvent<HTMLTextAreaElement>,
    state?: ContextStore
  ) => void;
}

function Markdown({ value, onChange, onContextMenu, style }: MarkdownProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [editorHeight, setEditorHeight] = useState('200px');
  useEffect(() => {
    setEditorHeight(wrapperRef.current?.scrollHeight + 'px');
  }, []);
  return (
    <div
      ref={wrapperRef}
      className="note-markdown-wrapper"
      data-color-mode="light"
    >
      <MDEditor
        value={value}
        onChange={onChange}
        onContextMenu={onContextMenu}
        previewOptions={{ rehypePlugins: [[rehypeSanitize]] }}
        preview="preview"
        visibleDragbar={false}
        className="note-markdown-editor"
        style={{ ...style }}
        height={editorHeight}
      />
    </div>
  );
}

Content.Text = Text;
Content.Whiteboard = Whiteboard;
Content.Markdown = Markdown;

Note.Content = Content;
