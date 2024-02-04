import { atom } from 'recoil';

export type FilterState = {
  venueText?: string;
  masterTaskText?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
  scrollToDate?: string;
};

export const intialBookingFilterState: FilterState = {
  venueText: '',
  masterTaskText: '',
  status: 'all',
  startDate: null,
  endDate: null,
  scrollToDate: '',
};

export const filterState = atom({
  key: 'filterState',
  default: intialBookingFilterState,
});
