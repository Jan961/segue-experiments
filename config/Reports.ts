import { SelectOption } from 'components/core-ui-lib/Select/Select';

export const salesSummarySortOptions = [
  { value: 'date', text: 'Show Date' },
  { value: 'sales', text: 'Show Sales (Low to Highest)' },
  { value: 'change', text: 'Change (Lowest to highest)' },
];

export const marketingGraphOptions: SelectOption[] = [
  {
    value: 'salesVsPreviousTour',
    text: 'Sales vs Previous Tour',
  },
  {
    value: 'salesPercentageChange',
    text: 'Sales Percentage Change',
  },
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

export const currencyCodeToSymbolMap = {
  GBP: '£',
  EUR: '€',
  USD: '$',
};

export const venueSelectionOptions: SelectOption[] = [
  { text: 'All', value: 'all' },
  { text: 'On Sale', value: 'on_sale' },
  { text: 'Not Onsale', value: 'not_onsale' },
  { text: 'Marketing Plans Received', value: 'marketing_plans_received' },
  { text: 'Marketing Plans Not Received', value: 'marketing_plans_not_received' },
  { text: 'Contact Info Received', value: 'contact_info_received' },
  { text: 'Contact Info Not Received', value: 'contact_info_not_received' },
  { text: 'Print Requirements Received', value: 'print_requirements_received' },
  { text: 'Print Requirements Not Received', value: 'print_requirements_not_received' },
  { text: 'Marketing Costs Pending', value: 'marketing_costs_pending' },
  { text: 'Marketing Costs Approved', value: 'marketing_costs_approved' },
  { text: 'Marketing Costs Not Approved', value: 'marketing_costs_not_approved' },
];
