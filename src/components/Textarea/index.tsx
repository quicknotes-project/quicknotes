import { useEffect, useRef } from 'react';
import {
  Changeable,
  Classable,
  Clickable,
  HasValue,
  IDable,
  Nameable,
  Readonlyable,
  Styleable,
} from '../../types';
import { cn } from '../../utils';

interface TextProps
  extends Nameable,
    IDable,
    HasValue<string>,
    Changeable<HTMLTextAreaElement>,
    Clickable<HTMLTextAreaElement>,
    Classable,
    Styleable,
    Readonlyable {}

export default function Textarea({
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
    <div className="textarea-wrapper">
      <textarea
        ref={textareaRef}
        id={id}
        name={name}
        value={value}
        spellCheck="false"
        style={style}
        className={cn('textarea', className)}
        readOnly={readonly}
        onChange={onChange}
        onContextMenu={onContextMenu}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
