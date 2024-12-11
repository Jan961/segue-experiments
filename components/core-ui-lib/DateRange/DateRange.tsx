import { useEffect, useRef, useState } from 'react';
import DateInput from '../DateInput';
import Label from '../Label';
import { set, isBefore } from 'date-fns';
import classNames from 'classnames';
import { UTCDate } from '@date-fns/utc';

export type DateRangeValue = {
  from: UTCDate;
  to: UTCDate;
};

export type DateRangeError = {
  fromError: string;
  toError: string;
};

export interface DateRangeProps {
  className?: string;
  disabled?: boolean;
  testId?: string;
  label?: string;
  onChange: (v: DateRangeValue) => void;
  value?: DateRangeValue;
  minDate?: UTCDate;
  maxDate?: UTCDate;
  labelClass?: string;
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
  labelClass,
}: DateRangeProps) {
  const disabledClass = disabled ? `!bg-disabled-input !cursor-not-allowed !pointer-events-none` : '';

  const fromInputRef = useRef(null);
  const toInputRef = useRef(null);
  const [dateRange, setDateRange] = useState<DateRangeValue>({ from: null, to: null });
  const [errors, setErrors] = useState<DateRangeError>({ fromError: '', toError: '' });
  const formattedMinDate = setDateWithoutTime(minDate);
  const formattedMaxDate = setDateWithoutTime(maxDate);
  const checkDateRangeValid = (from: Date, to: Date) => {
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
    checkDateRangeValid(value?.from, value?.to);
    setDateRange({ from: value?.from, to: value?.to });
  }, [value]);

  const handleDateFromChange = (v: UTCDate) => {
    const updatedDate = { ...dateRange, from: v };
    if (checkDateRangeValid(updatedDate.from, updatedDate.to)) {
      setDateRange(updatedDate);
      onChange(updatedDate);
    } else {
      // The way date is set like this is to force state update
      fromInputRef?.current.setValue(dateRange.from || null);
    }
  };

  const handleDateToChange = (v: UTCDate) => {
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
        <div
          className={classNames(
            labelClass,
            'flex items-center min-w-fit h-[1.9375rem] border-r border-primary-border px-3',
          )}
        >
          <Label text={label} />
        </div>
      )}
      <DateInput
        testId={`${testId ? `${testId}-start-date` : 'start-date'}`}
        ref={fromInputRef}
        inputClass={`!shadow-none ${!errors?.fromError ? '!border-primary-white' : ''}`}
        value={dateRange.from}
        onChange={handleDateFromChange}
        error={errors?.fromError}
        minDate={minDate}
        maxDate={maxDate}
        disabled={disabled}
      />
      <span className="mx-1 text-primary-label">to</span>
      <DateInput
        testId={`${testId ? `${testId}-end-date` : 'end-date'}`}
        ref={toInputRef}
        inputClass={`!shadow-none ${!errors?.toError ? '!border-primary-white' : ''}`}
        value={dateRange.to}
        onChange={handleDateToChange}
        minDate={dateRange?.from || minDate}
        error={errors?.toError}
        maxDate={maxDate}
        disabled={disabled}
      />
    </div>
  );
}
