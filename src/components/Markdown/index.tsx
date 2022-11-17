import { useEffect, useRef, useState } from 'react';
import MDEditor, { ContextStore } from '@uiw/react-md-editor';
import rehypeSanitize from 'rehype-sanitize';
import { Clickable, HasValue, Styleable } from '../../types';
import './Markdown.css';

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
export default function Markdown({
  value,
  onChange,
  onContextMenu,
  style,
}: MarkdownProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [editorHeight, setEditorHeight] = useState('200px');
  useEffect(() => {
    setEditorHeight(wrapperRef.current?.scrollHeight + 'px');
  }, []);
  return (
    <div ref={wrapperRef} className="markdown-wrapper" data-color-mode="light">
      <MDEditor
        value={value}
        onChange={onChange}
        onContextMenu={onContextMenu}
        previewOptions={{ rehypePlugins: [[rehypeSanitize]] }}
        preview="preview"
        visibleDragbar={false}
        className="markdown-editor"
        style={{ ...style }}
        height={editorHeight}
      />
    </div>
  );
}
