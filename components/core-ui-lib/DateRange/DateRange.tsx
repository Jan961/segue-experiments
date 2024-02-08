import { useEffect, useRef, useState } from 'react';
import DateInput from '../DateInput';
import Label from '../Label';
import { set, isBefore } from 'date-fns';

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

const setDateWithoutTime = (date) => {
  return set(date, { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
};

export default function DateRange({
  className,
  disabled,
  testId,
  label,
  onChange,
  value,
  minDate = null,
  maxDate = null,
}: DateRangePorps) {
  const disabledClass = disabled ? `!bg-disabled-input !cursor-not-allowed !pointer-events-none` : '';

  const fromInputRef = useRef(null);
  const toInputRef = useRef(null);
  const [dateRange, setDateRange] = useState<DateRangeValue>({ from: null, to: null });
  const [errors, setErrors] = useState<DateRangeError>({ fromError: '', toError: '' });
  const formattedMinDate = setDateWithoutTime(minDate);
  const formattedMaxDate = setDateWithoutTime(maxDate);
  const checkDateRangeValid = (from: Date, to: Date) => {
    // console.log('In DateRange', minDate, from, isBefore(from, minDate));

    const formattedFromDate = setDateWithoutTime(from);
    const formattedToDate = setDateWithoutTime(to);

    const error =
      (minDate && isBefore(formattedFromDate, formattedMinDate)) ||
      (formattedMaxDate && isBefore(formattedMaxDate, formattedToDate)) ||
      isBefore(formattedToDate, formattedFromDate)
        ? 'Invalid date'
        : '';
    setErrors({ fromError: error, toError: error });

    return error === '';
  };

  useEffect(() => {
    checkDateRangeValid(value.from, value.to);
    if (!value) {
      setDateRange({ from: minDate, to: maxDate });
    } else {
      const from = value.from || minDate;
      const to = value?.to || maxDate;
      setDateRange({ from, to });
    }
  }, [value, minDate, maxDate]);

  const handleDateFromChange = (v: Date) => {
    const updatedDate = { ...dateRange, from: v };
    if (checkDateRangeValid(updatedDate.from, updatedDate.to)) {
      setDateRange(updatedDate);
      onChange(updatedDate);
    } else {
      // The way date is set like this is to force state update
      fromInputRef?.current.setValue(dateRange.from || null);
    }
  };

  const handleDateToChange = (v: Date) => {
    const updatedDate = { ...dateRange, to: v };
    if (checkDateRangeValid(updatedDate.from, updatedDate.to)) {
      setDateRange(updatedDate);
      onChange(updatedDate);
    } else {
      // The way date is set like this is to force state update
      setErrors(null);
      toInputRef?.current.setValue(dateRange.to || null, dateRange.from || null);
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
        ref={fromInputRef}
        inputClass={`!shadow-none ${!errors?.fromError ? '!border-primary-white' : ''}`}
        value={dateRange.from}
        onChange={handleDateFromChange}
        error={errors?.fromError}
        minDate={minDate}
        maxDate={maxDate}
      />
      <span className="mx-1 text-primary-label">to</span>
      <DateInput
        ref={toInputRef}
        inputClass={`!shadow-none ${!errors?.toError ? '!border-primary-white' : ''}`}
        value={dateRange.to}
        onChange={handleDateToChange}
        minDate={dateRange.from || minDate}
        error={errors?.toError}
        maxDate={maxDate}
      />
    </div>
  );
}
