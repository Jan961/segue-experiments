import { SelectOption } from 'components/core-ui-lib/Select/Select';

export const salesSummarySortOptions = [
  { value: 'date', text: 'Show Date' },
  { value: 'sales', text: 'Show Sales (Low to Highest)' },
  { value: 'change', text: 'Change (Lowest to highest)' },
];

export const getWeekOptions = (start: number, end: number): SelectOption[] => {
  const options = [];
  for (let week = start; week <= end; week++) {
    options.push({ value: week, text: week });
  }
  return options;
};

export const MIN_WEEK = 2;
export const MAX_WEEK = 99;

export const bookingStatusOptions: SelectOption[] = [
  { text: 'Confirmed (C)', value: 'C' },
  { text: 'Unconfirmed (U)', value: 'U' },
  { text: 'Cancelled (X)', value: 'X' },
];
