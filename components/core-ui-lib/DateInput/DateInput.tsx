import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TextInput from '../TextInput';
import { createRef, useEffect, useState } from 'react';
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

  useEffect(() => {
    if (value) {
      if (typeof value === 'string' && regex.test(value)) {
        setSelectedDate(new Date(value));
      } else if (value instanceof Date) {
        setSelectedDate(value);
      }
    } else {
      setSelectedDate(null);
    }
  }, [value]);

  const handleInputChange = (value: string) => {
    if (value) {
      if (regex.test(value) && moment(value, 'DD/MM/YY').isValid()) {
        const date = moment(value, 'DD/MM/YY').toDate();
        onChange(date);
      }
    } else {
      setSelectedDate(null);
      onChange(null);
    }
  };

  return (
    <div className={`relative h-[1.9375rem]`}>
      <DatePicker
        placeholderText="DD/MM/YY"
        dateFormat="dd/MM/yy"
        popperClassName="!z-50"
        onSelect={onChange}
        onChange={() => null}
        customInput={<TextInput ref={inputRef} iconName="calendar" className={inputClass} error={error} />}
        selected={selectedDate}
        onChangeRaw={(event) => handleInputChange(event.target.value)}
        strictParsing
        {...props}
      />
    </div>
  );
}
