import { BaseSyntheticEvent, forwardRef, KeyboardEvent, MutableRefObject, useEffect, useRef, useState } from 'react';
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
  inputFieldJump?: (goDownField: boolean, event?: any) => void;
}

const baseClass =
  'h-comp-height flex items-center justify-around text-sm p-1 text-primary-input-text rounded-md border border-primary-border ring-inset';

const focusClass = 'focus:ring-2 focus:ring-primary-input-text';
const inputClass = 'w-8 h-5/6 border-none focus:ring-0 text-center ring-0 p-0';

const disabledContainerClass = (disabled) => (disabled ? 'disabled-input !border-none !bg-gray-200' : focusClass);
const disabledInputClass = (disabled) => disabled && '!bg-gray-200';

const DEFAULT_TIME = { hrs: '', min: '', sec: '' };

const isOfTypTime = (t: any): t is Time => t.hrs !== undefined && t.min !== undefined;

const TimeInput = forwardRef<HTMLInputElement, TimeInputProps>(
  (
    { onChange, value, onBlur, disabled, className, tabIndexShow, index, onInput, inputFieldJump }: TimeInputProps,
    ref,
  ) => {
    const [time, setTime] = useState<Time>(DEFAULT_TIME);

    const hrsRef = useRef(null);
    const minsRef = useRef(null);
    const [hoursInputFocus, setHoursInputFocus] = useState<boolean>(true);

    //  This checks whether the press event is to go outside the current Time component or to just go forwards or backwards to the min/hrs cells
    //  If the inputFieldJump function is null then it will not try and jump up and down refs inside the PerformanceCellRenderer
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          if (hoursInputFocus) {
            if (!isNullOrEmpty(inputFieldJump)) inputFieldJump(false, event);
          } else {
            setHoursInputFocus(true);
            setInputFocus(event, hrsRef);
          }
        } else {
          if (hoursInputFocus) {
            setHoursInputFocus(false);
            setInputFocus(event, minsRef);
          } else {
            if (!isNullOrEmpty(inputFieldJump)) inputFieldJump(true, event);
          }
        }
      }
    };

    //  We have to disable the propagation and default functionality
    //  Or else the tab events would change cell in the AgGrid when we want to move between the inputs within this cell
    const setInputFocus = (e: BaseSyntheticEvent, targetRef: MutableRefObject<HTMLInputElement>) => {
      e.preventDefault();
      e.stopPropagation();
      targetRef.current.focus();
      targetRef.current.select();
    };

    const handleBlur = (e: BaseSyntheticEvent, inputRef: MutableRefObject<any>) => {
      const { name, value } = e.target;
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

    const filterTimeInput = (name: string, value) => {
      if (value.length < 3) {
        if (
          (name === 'hrs' && (parseInt(value) < 24 || value.length === 0)) ||
          (name === 'min' && (parseInt(value) < 60 || value.length === 0))
        ) {
          setTime((prev) => ({ ...prev, [name]: value }));
        }
      }
    };

    const handleChange = (e: BaseSyntheticEvent, minsInput = false) => {
      onChange(e);
      const { name, value } = e.target;
      filterTimeInput(name, value);
      //  When the input is filled it will move the focus to the mins input
      //  So that you can type 1730 and the input will be 17:30 without having to tab or click to change between the mins and hours inputs
      if (value.length === 2) {
        minsRef.current.select();
        if (minsInput) {
          if (!isNullOrEmpty(inputFieldJump)) inputFieldJump(true, e);
        }
      }
    };

    const handleInputChange = (e) => {
      if (!isNullOrEmpty(onInput)) {
        const { name, value } = onInput(e);
        filterTimeInput(name, value);
      }
    };

    const handleFocus = (e: BaseSyntheticEvent, inputRef: MutableRefObject<any>, hoursFocus: boolean) => {
      setHoursInputFocus(hoursFocus);
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
      <div ref={ref} className={classNames(baseClass, className, disabledContainerClass(disabled))} tabIndex={-1}>
        <input
          data-testid="hourInput"
          data-index={index}
          ref={hrsRef}
          name="hrs"
          value={time.hrs}
          placeholder="hh"
          type="text"
          className={classNames(inputClass, disabledInputClass(disabled))}
          onChange={(e) => handleChange(e)}
          onBlur={(e) => handleBlur(e, hrsRef)}
          onFocus={(e) => handleFocus(e, hrsRef, true)}
          disabled={disabled}
          tabIndex={tabIndexShow ? 0 : 1}
          onInput={handleInputChange}
          onKeyDown={(e) => handleKeyPress(e)}
          autoComplete="off"
        />
        <span className="">:</span>
        <input
          data-testid="minInput"
          ref={minsRef}
          name="min"
          value={time.min}
          placeholder="mm"
          className={classNames(inputClass, disabledInputClass(disabled))}
          onChange={(e) => handleChange(e, true)}
          onBlur={(e) => handleBlur(e, minsRef)}
          onFocus={(e) => handleFocus(e, minsRef, false)}
          disabled={disabled}
          tabIndex={tabIndexShow ? 0 : 2}
          onKeyDown={(e) => {
            handleKeyPress(e);
          }}
          data-index={index}
          onInput={handleInputChange}
        />
      </div>
    );
  },
);

TimeInput.displayName = 'TimeInput';

export default TimeInput;
