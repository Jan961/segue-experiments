import { useEffect, useState } from 'react';
import DateInput from '../DateInput';
import Label from '../Label';
import { isBefore } from 'date-fns';

export type DateRangeValue = {
  from: Date;
  to: Date;
};

export type DateRangeError = {
  fromError: string;
  toError: string;
};

interface DateRangePorps {
  className?: string;
  disabled?: boolean;
  testId?: string;
  label?: string;
  onChange: (v: DateRangeValue) => void;
  value?: DateRangeValue;
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

  const [dateRange, setDateRange] = useState<DateRangeValue>({ from: null, to: null });
  const [errors, setErrors] = useState<DateRangeError>({ fromError: '', toError: '' });

  useEffect(() => {
    setDateRange(value);
  }, [value]);

  const checkDateRangeValid = () => {
    const error = isBefore(dateRange.to, dateRange.from) ? 'Invalid date' : '';
    setErrors({ fromError: error, toError: error });
  };

  const handleDateFromChange = (v: Date) => {
    const updatedDate = { ...dateRange, from: v };
    setDateRange(updatedDate);
    onChange(updatedDate);
  };

  const handleDateToChange = (v: Date) => {
    const updatedDate = { ...dateRange, to: v };
    setDateRange(updatedDate);
    onChange(updatedDate);
  };

  useEffect(() => {
    checkDateRangeValid();
  }, [dateRange]);

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
        inputClass="border-primary-white !shadow-none"
        value={dateRange.from}
        onChange={handleDateFromChange}
        error={errors.fromError}
        minDate={minDate}
      />
      <span className="mx-2 text-primary-label">to</span>
      <DateInput
        inputClass="border-primary-white !shadow-none"
        value={dateRange.to}
        onChange={handleDateToChange}
        minDate={dateRange.from || null}
        error={errors.toError}
        maxDate={maxDate || null}
      />
    </div>
  );
}
