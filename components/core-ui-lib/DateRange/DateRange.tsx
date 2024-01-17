import { useState } from 'react';
import DateInput from '../DateInput';
import Label from '../Label';

interface DateRangePorps {
  className?: string;
  disabled?: boolean;
  testId?: string;
  label?: string;
}

export default function DateRange({ className, disabled, testId, label }: DateRangePorps) {
  const disabledClass = disabled ? `!bg-disabled !cursor-not-allowed !pointer-events-none` : '';

  const [dateFrom, setDateFrom] = useState();
  const [dateTo, setDateTo] = useState();
  console.log(dateFrom, dateTo);
  const handleDateFromChange = (v) => {
    setDateFrom(v);
  };

  const handleDateToChange = (v) => {
    setDateTo(v);
  };

  return (
    <div
      className={`${className} !shadow-sm-shadow border border-primary-border rounded-md flex items-center ${disabledClass}`}
      data-testid={`${testId ? `form-typeahead-${testId}` : 'form-typeahead'}`}
    >
      {label && (
        <div className="flex items-center min-w-fit h-[1.9375rem] border-r border-primary-border px-3">
          <Label text={label} />
        </div>
      )}
      <DateInput inputClass="border-none !shadow-none" value={dateFrom} onChange={handleDateFromChange} />
      <span className="mx-2 text-primary-label">to</span>
      <DateInput inputClass="border-none !shadow-none" value={dateTo} onChange={handleDateToChange} />
    </div>
  );
}
