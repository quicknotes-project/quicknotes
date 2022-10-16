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
        <div key={`button-select-option-${index}`}>
          <input
            id={`button-select-option-${index}`}
            name={`button-select-option-${index}`}
            type="checkbox"
            checked={value === option}
            onChange={() => onClick(option)}
            className={cn('button-select-option-input', className)}
          />
          <label
            htmlFor={`button-select-option-${index}`}
            className="button-select-option"
          >
            {option}
          </label>
        </div>
      ))}
      <form></form>
    </div>
  );
}
