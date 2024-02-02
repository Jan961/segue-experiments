import { useEffect, useState } from 'react';
import DateInput from '../DateInput';
import Label from '../Label';

export type DateRangeValue = {
  from: string;
  to: string;
};

interface DateRangePorps {
  className?: string;
  disabled?: boolean;
  testId?: string;
  label?: string;
  onChange: (v: DateRangeValue) => void;
  value?: DateRangeValue;
  minDate?: string;
  maxDate?: string;
}

export default function DateRange({
  className,
  disabled,
  testId,
  label,
  onChange,
  value,
  minDate,
  maxDate,
}: DateRangePorps) {
  const disabledClass = disabled ? `!bg-disabled !cursor-not-allowed !pointer-events-none` : '';

  const [dateFrom, setDateFrom] = useState<string>();
  const [dateTo, setDateTo] = useState<string>();

  useEffect(() => {
    setDateFrom(value.from);
  }, [value.from]);

  useEffect(() => {
    setDateTo(value.to);
  }, [value.to]);

  const handleDateFromChange = (v) => {
    setDateFrom(v);
    setDateTo(v);
    onChange({ from: v, to: v });
  };

  const handleDateToChange = (v) => {
    setDateTo(v);
    onChange({ from: dateFrom, to: v });
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
      <DateInput
        inputClass="border-none !shadow-none"
        value={dateFrom}
        onChange={handleDateFromChange}
        minDate={minDate ? new Date(minDate) : null}
      />
      <span className="mx-2 text-primary-label">to</span>
      <DateInput
        inputClass="border-none !shadow-none"
        value={dateTo}
        onChange={handleDateToChange}
        minDate={dateFrom ? new Date(dateFrom) : null}
        maxDate={maxDate ? new Date(maxDate) : null}
      />
    </div>
  );
}
