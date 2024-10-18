import React, { FC, useMemo, useState } from 'react';
import classNames from 'classnames';
import { SelectOption } from '../Select/Select';
import { generateRandomHash } from 'utils/crypto';
import Radio from './Radio';

export enum Direction {
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal',
}

export interface RadioGroupProps {
  options: SelectOption[];
  direction: Direction;
  value: string;
  className?: string;
  testId?: string;
  onChange: (value: string) => void;
}

const RadioGroup: FC<RadioGroupProps> = ({
  options,
  direction,
  onChange,
  value,
  className,
  testId = 'core-ui-lib-radio-group',
}) => {
  const [selection, setSelection] = useState(value);
  // name has to be unique for the group
  const name = useMemo(() => generateRandomHash(8), []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.currentTarget.value);
    setSelection(event.currentTarget.value);
  };

  return (
    <div
      data-testid={testId}
      className={classNames('flex', {
        'flex-col': direction === Direction.VERTICAL,
        'flex-row items-center gap-2': direction === Direction.HORIZONTAL,
      })}
    >
      {options.map((option, i) => (
        <Radio
          name={name}
          key={i}
          value={selection}
          handleChange={handleChange}
          option={option}
          className={className}
        />
      ))}
    </div>
  );
};

export default RadioGroup;
