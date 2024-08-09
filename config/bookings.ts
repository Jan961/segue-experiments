import { SelectOption } from 'components/core-ui-lib/Select/Select';

export const statusOptions: SelectOption[] = [
  { text: 'Confirmed', value: 'C' },
  { text: 'Pencilled', value: 'U' },
  { text: 'Cancelled', value: 'X' },
  { text: 'Suspended', value: 'S' },
  { text: 'Available', value: 'A' },
];
export const allStatusOptions: SelectOption[] = [{ text: 'All', value: 'all' }, ...statusOptions];

export const bookingStatusMap = {
  C: 'Confirmed',
  U: 'Pencilled',
  X: 'Cancelled',
  S: 'Suspended',
};

export const bookingRow = {
  Id: null,
  date: '',
  dateTime: '',
  week: '',
  venue: '',
  town: '',
  performanceCount: '',
  performanceTimes: '',
  productionName: '',
  productionId: null,
  production: null,
  bookingStatus: '',
  status: '',
  dayType: '',
  capacity: null,
  note: '',
};

export const defaultVenueFilters = {
  venueId: null,
  town: '',
  country: null,
  productionId: null,
  search: '',
};
