import React from 'react';
import { cn } from '../../utils';
import { Classable, HasValue, Substitutable } from '../../types';
import './Pill.css'

interface PillProps extends Substitutable, Classable, HasValue<string> {
  color: string;
}

export default function Pill({ as, value, color, className }: PillProps) {
  return React.createElement(
    as || 'li',
    {
      className: cn('pill', className),
      style: {
        '--color': color,
      },
    },
    value
  );
}
