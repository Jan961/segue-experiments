import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TextInput from '../TextInput';
import React, { createRef, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import Label from '../Label';
import { Portal } from 'react-overlays';
import { isValid } from 'date-fns';
import { UTCDate } from '@date-fns/utc';
import { formatDate, newDate, safeDate } from 'services/dateService';

export interface DateInputProps {
  value?: string | Date;
  onChange: (value: UTCDate) => void;
  inputClass?: string;
  error?: string;
  minDate?: UTCDate;
  maxDate?: UTCDate;
  placeholder?: string;
  popperClassName?: string;
  className?: string;
  label?: string;
  labelClassName?: string;
  disabled?: boolean;
  position?: string;
  testId?: string;
}

const regex = /^\d{2}\/\d{2}\/\d{2}$/;

type Ref = {
  setValue: (value: UTCDate | null, useIfValueNull: UTCDate | null) => void;
} | null;

export default forwardRef<Ref, DateInputProps>(function DateInput(
  {
    value,
    onChange,
    error = '',
    inputClass = '',
    minDate,
    maxDate,
    placeholder = 'DD/MM/YY',
    label,
    labelClassName,
    disabled = false,
    position = '',
    testId,
    ...props
  }: DateInputProps,
  ref,
) {
  const inputRef = createRef<HTMLInputElement>();
  const [selectedDate, setSelectedDate] = useState<UTCDate>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const dpRef = useRef(null);

  const setDateValue = (dateValue, useIfValueNull = null) => {
    if (dateValue) {
      if (typeof dateValue === 'string' && regex.test(dateValue)) {
        setInputValue(dateValue);
        setSelectedDate(safeDate(dateValue));
      } else {
        setInputValue(formatDate(dateValue, 'dd/MM/yy'));
        setSelectedDate(safeDate(dateValue));
      }
    } else {
      setInputValue('');
      setSelectedDate(useIfValueNull);
    }
  };

  useImperativeHandle(ref, () => ({
    setValue: (value: UTCDate | null, useIfValueNull: UTCDate | null) => {
      setDateValue(value, useIfValueNull);
    },
  }));

  useEffect(() => {
    setDateValue(value);
  }, [value]);

  useEffect(() => {
    setErrorMsg(error);
  }, [error]);

  const getDateFromInputValue = (): UTCDate => {
    if (inputValue) {
      const date = newDate(inputValue, 'UK');
      return date;
    } else {
      return null;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setErrorMsg('');
    if (value) {
      if (value.length < 9) {
        let dateText = value.replace(/\D/g, '');
        dateText = dateText.replace(/(\d{2})(?=\d)/g, '$1/');
        setInputValue(dateText);
        if (regex.test(inputValue) && !isValid(inputValue)) {
          setErrorMsg('Invalid Date');
        }
      }
    } else {
      setInputValue('');
    }
  };

  const handleInputFocus = () => {
    inputRef?.current?.select();
  };

  const handleInputBlur = () => {
    setErrorMsg('');
    if (inputValue) {
      const d = getDateFromInputValue();
      if (regex.test(inputValue) && isValid(d)) {
        onChange(d);
        setSelectedDate(d);
      } else {
        if (value) {
          setInputValue(formatDate(d, 'dd/MM/yy'));
        } else {
          setInputValue('');
        }
      }
    } else {
      setSelectedDate(null);
      onChange(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Enter') {
      inputRef.current.blur();
    }
  };

  const CalendarContainer = (props: { children }) => {
    const el = document.getElementById('calendar-portal');
    return <Portal container={el}>{props.children}</Portal>;
  };

  return (
    <div
      className={`relative h-[1.9375rem] flex flex-row rounded-md ${
        label ? 'border border-primary-border shadow-sm-shadow' : ''
      }`}
    >
      <div className="flex flex-col">
        {label && (
          <div data-testid={`${testId}-label`} className="border-r min-w-fit border-primary-border px-3">
            <Label className={labelClassName} text={label} />
          </div>
        )}
      </div>
      <div data-testid={`${testId}-picker`} className="absolute right-3 top-3 z-10 flex flex-col">
        <DatePicker
          popperContainer={CalendarContainer}
          ref={dpRef}
          minDate={minDate}
          maxDate={maxDate}
          placeholderText={placeholder}
          dateFormat="dd/MM/yy"
          popperClassName={`!z-50 ${position}`}
          onChange={(e) => onChange(new UTCDate(e))}
          selected={selectedDate}
          openToDate={selectedDate}
          customInput={<div className="cursor-pointer w-4 h-4 " />}
          disabled={disabled}
          {...props}
        />
      </div>
      <div data-testid={`${testId}-input`} className={errorMsg ? 'animate-shake' : ''}>
        <TextInput
          testId="date-input"
          placeholder={placeholder}
          ref={inputRef}
          value={inputValue}
          iconName="calendar"
          className={`w-28 h-[1.8375rem] ${inputClass}`}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
      </div>
    </div>
  );
});
