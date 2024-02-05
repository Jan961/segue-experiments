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
  minDate?: Date;
  maxDate?: Date;
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
    checkDateRangeValid(value.from, value.to);
    setDateRange(value);
  }, [value]);

  const checkDateRangeValid = (from: Date, to: Date) => {
    const error = isBefore(to, from) ? 'Invalid date' : '';
    setErrors({ fromError: error, toError: error });
    return error === '';
  };

  const handleDateFromChange = (v: Date) => {
    const updatedDate = { ...dateRange, from: v };
    setDateRange(updatedDate);
    if (checkDateRangeValid(updatedDate.from, updatedDate.to)) {
      onChange(updatedDate);
    }
  };

  const handleDateToChange = (v: Date) => {
    const updatedDate = { ...dateRange, to: v };
    setDateRange(updatedDate);
    if (checkDateRangeValid(updatedDate.from, updatedDate.to)) {
      onChange(updatedDate);
    }
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
        inputClass={`!shadow-none ${!errors?.fromError ? '!border-primary-white' : ''}`}
        value={dateRange.from}
        onChange={handleDateFromChange}
        error={errors.fromError}
        minDate={minDate}
      />
      <span className="mx-1 text-primary-label">to</span>
      <DateInput
        inputClass={`!shadow-none ${!errors?.toError ? '!border-primary-white' : ''}`}
        value={dateRange.to}
        onChange={handleDateToChange}
        minDate={dateRange.from || null}
        error={errors.toError}
        maxDate={maxDate || null}
      />
    </div>
  );
}
