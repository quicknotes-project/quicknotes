import { cn } from '../../utils';
import { Classable, HasValue } from '../../types';
import './ButtonSelect.css';

interface ButtonSelectProps extends Classable, HasValue<string> {
  options: readonly string[];
  onClick: (option: string) => any;
}

export default function ButtonSelect({
  value,
  options,
  onClick,
  className,
}: ButtonSelectProps) {
  return (
    <div className={cn('button-select', className)}>
      {options?.map((option, index) => (
        <button
          key={`button-select-option-${index}`}
          onClick={() => onClick(option)}
          className={cn(
            'button-select-option',
            { active: option === value },
            className
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
