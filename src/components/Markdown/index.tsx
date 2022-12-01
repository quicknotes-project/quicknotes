import { useEffect, useRef, useState } from 'react';
import MDEditor, { MDEditorProps } from '@uiw/react-md-editor';
import rehypeSanitize from 'rehype-sanitize';
import './Markdown.css';

interface MarkdownProps extends MDEditorProps {}

export default function Markdown(props: MarkdownProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [editorHeight, setEditorHeight] = useState('200px');
  useEffect(() => {
    setEditorHeight(wrapperRef.current?.scrollHeight + 'px');
  }, []);
  return (
    <div ref={wrapperRef} className="markdown-wrapper" data-color-mode="dark">
      <MDEditor
        previewOptions={{ rehypePlugins: [[rehypeSanitize]] }}
        preview="preview"
        visibleDragbar={false}
        className="markdown-editor"
        height={editorHeight}
        {...props}
      />
    </div>
  );
}
