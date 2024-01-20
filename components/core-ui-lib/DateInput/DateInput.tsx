import DatePicker, { ReactDatePickerProps } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TextInput from '../TextInput';
import { createRef } from 'react';

interface DateInputProps extends ReactDatePickerProps {
  value?: string;
  onChange: (value: Date) => void;
  inputClass?: string;
}

export default function DateInput({ value, onChange, inputClass = '', ...props }: DateInputProps) {
  const inputRef = createRef<HTMLInputElement>();
  return (
    <div className="relative h-[1.9375rem]">
      <DatePicker
        placeholderText="DD/MM/YY"
        dateFormat="dd/MM/yy"
        popperClassName="!z-50"
        onChange={onChange}
        customInput={<TextInput ref={inputRef} iconName="calendar" className={inputClass} />}
        selected={value ? new Date(value) : null}
        {...props}
      />
    </div>
  );
}
