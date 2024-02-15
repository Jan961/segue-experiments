import { useEffect, useState } from 'react';
import Label from '../Label';
import classNames from 'classnames';

type Time = {
  hrs?: string;
  min?: string;
  sec?: string;
};

interface TimeInputProps {
  onChange: (e: any) => void;
  onBlur?: (e: any) => void;
  label?: string;
  value: string | Time;
  name?: string; // Also ID
  disabled?: boolean;
  className?: string;
}

const baseClass =
  'flex items-center justify-around text-sm p-1 text-primary-input-text rounded-md border border-primary-border focus:ring-2 focus:ring-primary-input-text ring-inset';
const DEFAULT_TIME = { hrs: '00', min: '00', sec: '00' };

const isOfTypTime = (t: any): t is Time => t.hrs !== undefined && t.min !== undefined;

export default function TimeInput({ onChange, value, onBlur, disabled, className }: TimeInputProps) {
  const [time, setTime] = useState<Time>(DEFAULT_TIME);
  const disabledClass = disabled ? `!bg-disabled-input !cursor-not-allowed !pointer-events-none` : '';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const v = value.replace(/^\D/, '');
    if (v.length < 3) {
      if (name === 'hrs' && (v === '' || parseInt(value) < 24)) {
        setTime((prev) => ({ ...prev, [name]: v }));
      } else if (name === 'min' && (v === '' || parseInt(value) < 60)) {
        setTime((prev) => ({ ...prev, [name]: v }));
      }
    }
  };

  const handleInputBlur = (e) => {
    if (!disabled) {
      const { name } = e.target;
      const currValue = time[name];
      if (currValue.length === 0) {
        setTime((prev) => ({ ...prev, [name]: '00' }));
      } else if (currValue.length === 1) {
        setTime((prev) => ({ ...prev, [name]: `0${currValue}` }));
      }
    }
  };

  const handleBlur = () => {
    onChange(time);
    onBlur?.(time);
  };

  useEffect(() => {
    if (value) {
      if (isOfTypTime(value)) {
        setTime(value);
      } else if (typeof value === 'string') {
        const parts = value.split(':');
        setTime({ hrs: parts[0] || '00', min: parts[1] || '00', sec: parts[1] || '00' });
      }
    } else {
      setTime(DEFAULT_TIME);
    }
  }, [value]);

  return disabled ? (
    <Label text={`${time.hrs} : ${time.min}`} className={`${baseClass} ${disabledClass}`} />
  ) : (
    <div onBlur={handleBlur} className={classNames(baseClass, className)}>
      <input
        name="hrs"
        value={time.hrs}
        type="text"
        className="w-10 h-comp-height border-none focus:ring-0 text-end ring-0"
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onFocus={(e) => e.target.select}
        disabled={disabled}
      />
      <span className="">:</span>
      <input
        name="min"
        value={time.min}
        className="w-10 h-comp-height border-none focus:ring-0 ring-0"
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onFocus={(e) => e.target.select}
        disabled={disabled}
      />
    </div>
  );
}
