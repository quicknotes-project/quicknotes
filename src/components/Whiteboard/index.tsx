import { useState } from 'react';
import { useSvgDrawing } from 'react-hooks-svgdrawing';
import { DrawingOption } from 'svg-drawing';
import { Classable } from '../../types';
import { cn } from '../../utils';
import './Whiteboard.css';

interface WhiteboardProps extends Classable, Partial<DrawingOption> {
  width?: number;
  height?: number;
}

export default function Whiteboard({
  className,
  width = 300,
  height = 300,

  penWidth = 8,
  ...rest
}: WhiteboardProps) {
  const [xml, setXml] = useState('');

  const [
    renderRef,
    { instance, undo, clear, getSvgXML, changePenColor, changePenWidth },
  ] = useSvgDrawing({ penWidth, ...rest });

  return (
    <div
      ref={renderRef}
      className={cn('whiteboard', className)}
      onPointerUp={() => {
        setXml(getSvgXML() ?? '');
      }}
      style={{ width, height }}
    />
  );
}
