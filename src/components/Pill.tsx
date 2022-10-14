import React from 'react';
import cn, { Argument as ClassArgument } from 'classnames';
import { Substitutable } from '../types';

interface PillProps extends Substitutable {
  value: string;
  color: string;
  className?: ClassArgument;
}

export default function Pill({ as, value, color, className }: PillProps) {
  return React.createElement(
    as,
    {
      className: cn('pill', className),
      style: {
        '--color': color,
      },
    },
    value
  );
}
