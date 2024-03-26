import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TextInput from '../TextInput';
import React, { createRef, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import moment from 'moment';
import { convertLocalDateToUTC } from 'services/dateService';
import { shortDateRegex } from 'utils/regexUtils';

interface DateInputProps {
  value?: string | Date;
  onChange: (value: Date) => void;
  inputClass?: string;
  error?: string;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
  popperClassName?: string;
  className?: string;
}

const regex = /^\d{2}\/\d{2}\/\d{2}$/;

type Ref = {
  setValue: (value: Date | null, useIfValueNull: Date | null) => void;
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
    ...props
  }: DateInputProps,
  ref,
) {
  const inputRef = createRef<HTMLInputElement>();
  const [selectedDate, setSelectedDate] = useState<Date>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const dpRef = useRef(null);

  const setDateValue = (dateValue, useIfValueNull = null) => {
    if (dateValue) {
      if (typeof dateValue === 'string' && regex.test(dateValue)) {
        setInputValue(dateValue);
        setSelectedDate(new Date(dateValue));
      } else {
        setInputValue(moment(dateValue).format('DD/MM/YY'));
        setSelectedDate(dateValue as Date);
      }
    } else {
      setInputValue('');

      setSelectedDate(useIfValueNull);
    }
  };

  useImperativeHandle(ref, () => ({
    setValue: (value: Date | null, useIfValueNull: Date | null) => {
      setDateValue(value, useIfValueNull);
    },
  }));

  useEffect(() => {
    setDateValue(value);
  }, [value]);

  useEffect(() => {
    setErrorMsg(error);
  }, [error]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setErrorMsg('');
    if (value) {
      if (value.length < 9) {
        let dateText = value.replace(/\D/g, '');
        dateText = dateText.replace(/(\d{2})(?=\d)/g, '$1/');

        setInputValue(dateText);
        if (regex.test(inputValue) && !moment(inputValue, 'DD/MM/YY').isValid()) {
          setErrorMsg('Invalid Date');
        }
      }
    } else {
      setInputValue('');
    }
  };

  useEffect(() => {
    if (inputValue && inputValue.match(shortDateRegex)) {
      inputRef?.current?.select();
    }
  }, [inputValue]);

  const handleInputFocus = () => {
    inputRef?.current?.select();
  };

  const handleInputBlur = () => {
    setErrorMsg('');
    if (inputValue) {
      if (regex.test(inputValue) && moment(inputValue, 'DD/MM/YY').isValid()) {
        const date = moment.utc(inputValue, 'DD/MM/YY').toDate();
        onChange(date);
        setSelectedDate(date);
      } else {
        if (value) {
          setInputValue(moment(value).format('DD/MM/YY'));
        } else {
          setInputValue('');
        }
      }
    } else {
      setSelectedDate(null);
      onChange(null);
    }
  };

  return (
    <div className={`relative h-[1.9375rem]`}>
      <div className="absolute right-3 top-3 z-10">
        <DatePicker
          ref={dpRef}
          minDate={minDate}
          maxDate={maxDate}
          placeholderText={placeholder}
          dateFormat="dd/MM/yy"
          popperClassName="!z-50"
          onSelect={(e) => onChange(convertLocalDateToUTC(e))}
          onChange={() => null}
          selected={selectedDate}
          openToDate={selectedDate}
          customInput={<div className="cursor-pointer w-4 h-4 " />}
          {...props}
        />
      </div>
      <div className={errorMsg ? 'animate-shake' : ''}>
        <TextInput
          placeholder={placeholder}
          ref={inputRef}
          value={inputValue}
          iconName="calendar"
          className={`w-28 ${inputClass}`}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
      </div>
    </div>
  );
});
