import { SelectOption } from 'components/core-ui-lib/Select/Select';

export const statusOptions: SelectOption[] = [
  { text: 'ALL', value: '' },
  { text: 'Confirmed (C)', value: 'C' },
  { text: 'Unconfirmed (U)', value: 'U' },
  { text: 'Cancelled (X)', value: 'X' },
  { text: 'Suspended (S)', value: 'S' },
];

export const bookingStatusMap = {
  C: 'Confirmed',
  U: 'Pencilled',
  X: 'Cancelled',
  S: 'Suspended',
};
