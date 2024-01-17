import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TextInput from '../TextInput';
import { createRef } from 'react';

interface DateInputProps {
  value?: string | Date;
  onChange?: (value: any) => void;
  inputClass?: string;
}

export default function DateInput({ value, onChange, inputClass = '' }: DateInputProps) {
  const inputRef = createRef<HTMLInputElement>();
  return (
    <div className="relative h-[1.9375rem]">
      <DatePicker
        selected={value}
        onChange={onChange}
        customInput={<TextInput ref={inputRef} iconName="calendar" className={inputClass} />}
        customInputRef={inputRef}
      />
    </div>
  );
}
