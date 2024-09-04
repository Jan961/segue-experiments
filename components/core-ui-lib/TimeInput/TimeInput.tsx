import { forwardRef, KeyboardEvent, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { isNullOrEmpty } from 'utils';

export type Time = {
  hrs?: string;
  min?: string;
  sec?: string;
};

export interface TimeInputProps {
  onChange: (e: any) => any;
  onBlur?: (e: any) => void;
  onInput?: (e: any) => { name: string; value: string };
  label?: string;
  value: string | Time;
  name?: string; // Also ID
  disabled?: boolean;
  className?: string;
  tabIndexShow?: boolean;
  index?: number;
}

const baseClass =
  'h-comp-height flex items-center justify-around text-sm p-1 text-primary-input-text rounded-md border border-primary-border focus:ring-2 focus:ring-primary-input-text ring-inset';
const DEFAULT_TIME = { hrs: '', min: '', sec: '' };

const isOfTypTime = (t: any): t is Time => t.hrs !== undefined && t.min !== undefined;

const TimeInput = forwardRef<HTMLInputElement, TimeInputProps>(
  ({ onChange, value, onBlur, disabled, className, tabIndexShow, index, onInput }: TimeInputProps, ref) => {
    const [time, setTime] = useState<Time>(DEFAULT_TIME);
    const hrsRef = useRef(null);
    const minsRef = useRef(null);
    const [currentFocus, setCurrentFocus] = useState<string>('hrs');

    const handleMinKeyDown = (e) => {
      if (e.shiftKey && e.code === 'Tab') {
        hrsRef.current.select();
      }
    };

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        if (currentFocus === 'hrs') {
          setCurrentFocus('hrs');
          minsRef.current.select();
        }
      }
    };

    const handleBlur = (e, inputRef) => {
      const { name, value } = e.target;
      console.log(inputRef.current);
      if (inputRef.current) {
        inputRef.current.hasSelected = false;
      }

      // Add leading zero if needed
      const paddedValue = value.length === 1 ? `0${value}` : value;

      if (!isNullOrEmpty(onBlur)) {
        onBlur({ ...e, target: { ...e.target, value: paddedValue } });
      } else {
        filterTimeInput(name, paddedValue);
      }
    };

    const filterTimeInput = (name, value) => {
      if (value.length < 3) {
        if (
          (name === 'hrs' && (parseInt(value) < 24 || value.length === 0)) ||
          (name === 'min' && (parseInt(value) < 60 || value.length === 0))
        ) {
          setTime((prev) => ({ ...prev, [name]: value }));
        }
      }
    };

    const handleChange = (e) => {
      onChange(e);
      const { name, value } = e.target;
      filterTimeInput(name, value);
    };

    const handleInputChange = (e) => {
      if (!isNullOrEmpty(onInput)) {
        const { name, value } = onInput(e);
        filterTimeInput(name, value);
      }
    };

    const handleFocus = (e, inputRef) => {
      if (inputRef.current && !inputRef.current.hasSelected) {
        e.stopPropagation();
        e.preventDefault();
        e.target.select();
        inputRef.current.hasSelected = true;
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

    return (
      <div
        ref={ref}
        className={classNames(baseClass, className)}
        tabIndex={-1} // Make the div focusable
      >
        <input
          data-testid="hourInput"
          data-index={index}
          ref={hrsRef}
          name="hrs"
          value={time.hrs}
          placeholder="hh"
          type="text"
          className="w-8 h-5/6 border-none focus:ring-0 text-center ring-0 p-0"
          onChange={handleChange}
          onBlur={(e) => handleBlur(e, hrsRef)}
          onFocus={(e) => handleFocus(e, hrsRef)}
          disabled={disabled}
          tabIndex={tabIndexShow ? 0 : 1}
          onInput={handleInputChange}
          onKeyDown={(e) => handleKeyPress(e)}
        />
        <span className="">:</span>
        <input
          data-testid="minInput"
          ref={minsRef}
          name="min"
          value={time.min}
          placeholder="mm"
          className="w-8 h-5/6 border-none focus:ring-0 text-center ring-0 p-0"
          onChange={handleChange}
          onBlur={(e) => handleBlur(e, minsRef)}
          onFocus={(e) => handleFocus(e, minsRef)}
          disabled={disabled}
          tabIndex={tabIndexShow ? 0 : 2}
          onKeyDown={handleMinKeyDown}
          data-index={index}
          onInput={handleInputChange}
        />
      </div>
    );
  },
);

TimeInput.displayName = 'TimeInput';

export default TimeInput;
