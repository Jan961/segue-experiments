import { forwardRef, useEffect, useRef, useState } from 'react';
import Label from '../Label';
import classNames from 'classnames';
import { isNullOrEmpty } from 'utils';

export type Time = {
  hrs?: string;
  min?: string;
  sec?: string;
};

export interface TimeInputProps {
  onChange: (e: any) => void;
  onBlur?: (e: any) => void;
  label?: string;
  value: string | Time;
  name?: string; // Also ID
  disabled?: boolean;
  className?: string;
}

const baseClass =
  'h-comp-height flex items-center justify-around text-sm p-1 text-primary-input-text rounded-md border border-primary-border focus:ring-2 focus:ring-primary-input-text ring-inset';
const DEFAULT_TIME = { hrs: '', min: '', sec: '' };

const isOfTypTime = (t: any): t is Time => t.hrs !== undefined && t.min !== undefined;

const TimeInput = forwardRef<HTMLInputElement, TimeInputProps>(
  ({ onChange, value, onBlur, disabled, className }: TimeInputProps, ref) => {
    const [time, setTime] = useState<Time>(DEFAULT_TIME);
    const [isFocused, setIsFocused] = useState(false);
    const disabledClass = disabled ? `!bg-disabled-input !cursor-not-allowed !pointer-events-none` : '';
    const hrsRef = useRef(null);
    const minsRef = useRef(null);

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
        if (name === 'hrs') {
          minsRef.current.select();
        }
        const currValue = time[name];

        // if null, don't change
        if (isNullOrEmpty(currValue)) {
          setTime((prev) => ({ ...prev, [name]: '' }));
        } else {
          if (currValue.length === 1) {
            setTime((prev) => ({ ...prev, [name]: `0${currValue}` }));
          } else {
            setTime((prev) => ({ ...prev, [name]: `${currValue}` }));
          }
        }
      }
    };

    const handleBlur = () => {
      if (isFocused) {
        onChange(time);
        onBlur?.({ ...time, sec: time.sec || '' });
        setIsFocused(false);
      }
    };

    const handleFocus = () => {
      setIsFocused(true);
    };

    const handleMinKeyDown = (e) => {
      if (e.shiftKey && e.code === 'Tab') {
        hrsRef.current.select();
      }
    };

    useEffect(() => {
      if (value) {
        if (isOfTypTime(value)) {
          setTime({ ...value, sec: value.sec || '' });
        } else if (typeof value === 'string') {
          const parts = value.split(':');
          setTime({
            hrs: parts[0] === undefined ? '00' : parts[0],
            min: parts[1] === undefined ? '00' : parts[1],
            sec: parts[2] === undefined ? '00' : parts[2],
          });
        }
      } else {
        setTime(DEFAULT_TIME);
      }
    }, [value]);

    return disabled ? (
      <Label text={`${time.hrs} : ${time.min}`} className={`${baseClass} ${disabledClass}`} />
    ) : (
      <div
        ref={ref}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={classNames(baseClass, className)}
        tabIndex={-1} // Make the div focusable
      >
        <input
          data-testid="hourInput"
          ref={hrsRef}
          name="hrs"
          value={time.hrs}
          placeholder="hh"
          type="text"
          className="w-8 h-5/6 border-none focus:ring-0 text-center ring-0 p-0"
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onFocus={(e) => e.target.select()}
          disabled={disabled}
          tabIndex={1}
        />
        <span className="">:</span>
        <input
          data-testid="minInput"
          ref={minsRef}
          name="min"
          value={time.min}
          placeholder="mm"
          className="w-8 h-5/6 border-none focus:ring-0 text-center ring-0 p-0"
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onFocus={(e) => e.target.select()}
          disabled={disabled}
          tabIndex={2}
          onKeyDown={handleMinKeyDown}
        />
      </div>
    );
  },
);

TimeInput.displayName = 'TimeInput';

export default TimeInput;
