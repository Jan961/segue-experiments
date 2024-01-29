import { atom } from 'recoil';

export type FilterState = {
  venueText?: string;
  masterTaskText?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
};

export const intialBookingFilterState: FilterState = {
  venueText: '',
  masterTaskText: '',
  status: null,
  startDate: '',
  endDate: '',
};

export const filterState = atom({
  key: 'filterState',
  default: intialBookingFilterState,
});
