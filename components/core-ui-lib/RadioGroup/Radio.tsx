import React, { FC, useMemo } from 'react';
import { SelectOption } from '../Select/Select';

interface RadioProps {
  value: string;
  option: SelectOption;
  name: string;
  className?: string;
  handleChange: (value: React.ChangeEvent<HTMLInputElement>) => void;
}

const Radio: FC<RadioProps> = ({ value, option, name, className, handleChange }) => {
  const checked = useMemo(() => value === option.value, [option, value]);
  return (
    <label key={option.value as string} className="flex items-center space-x-2">
      <input
        type="radio"
        name={name}
        value={option.value as string}
        checked={checked}
        onChange={handleChange}
        className="text-primary-navy"
      />
      <span className={className}>{option.text}</span>
    </label>
  );
};

export default Radio;
