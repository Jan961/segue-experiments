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
<<<<<<< HEAD
  status: 'all',
  startDate: '',
  endDate: '',
=======
  status: null,
  startDate: null,
  endDate: null,
  scrollToDate: '',
>>>>>>> 4e38a7a (Changes to Date and DateRange)
};

export const filterState = atom({
  key: 'filterState',
  default: intialBookingFilterState,
});
