import { UTCDate } from '@date-fns/utc';
import { atom } from 'recoil';

export type FilterState = {
  venueText?: string;
  masterTaskText?: string;
  status?: string;
  startDate?: UTCDate;
  endDate?: UTCDate;
  scrollToDate?: string;
  scheduleStartDate?: UTCDate;
  scheduleEndDate?: UTCDate;
};

export const intialBookingFilterState: FilterState = {
  venueText: '',
  masterTaskText: '',
  status: 'all',
  startDate: null,
  endDate: null,
  scrollToDate: '',
  scheduleStartDate: null,
  scheduleEndDate: null,
};

export const filterState = atom({
  key: 'filterState',
  default: intialBookingFilterState,
});
