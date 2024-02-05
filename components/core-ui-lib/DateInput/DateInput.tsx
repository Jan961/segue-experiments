import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TextInput from '../TextInput';
import React, { createRef, useEffect, useRef, useState } from 'react';
import moment from 'moment';

interface DateInputProps {
  value?: string | Date;
  onChange: (value: Date) => void;
  inputClass?: string;
  error?: string;
  minDate?: Date;
  maxDate?: Date;
}

const regex = /^\d{2}\/\d{2}\/\d{2}$/;

export default function DateInput({ value, onChange, error = '', inputClass = '', ...props }: DateInputProps) {
  const inputRef = createRef<HTMLInputElement>();
  const [selectedDate, setSelectedDate] = useState<Date>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const dpRef = useRef(null);
  useEffect(() => {
    if (value) {
      if (typeof value === 'string' && regex.test(value)) {
        setInputValue(value);
        setSelectedDate(new Date(value));
      } else if (value instanceof Date) {
        setInputValue(moment(value).format('DD/MM/YY'));
        setSelectedDate(value);
      }
    } else {
      setInputValue('');
      setSelectedDate(null);
    }
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

  const handleInputFocus = () => {
    inputRef.current.select();
  };

  const handleInputBlur = () => {
    setErrorMsg('');
    if (inputValue) {
      if (regex.test(inputValue) && moment(inputValue, 'DD/MM/YY').isValid()) {
        const date = moment(inputValue, 'DD/MM/YY').toDate();
        onChange(date);
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
          placeholderText="DD/MM/YY"
          dateFormat="dd/MM/yy"
          popperClassName="!z-50"
          onSelect={onChange}
          onChange={() => null}
          selected={selectedDate}
          customInput={<div className="w-4 h-4 " ref={inputRef} />}
          {...props}
        />
      </div>
      <div className={errorMsg ? 'animate-shake' : ''}>
        <TextInput
          placeHolder="DD/MM/YY"
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
}
