import { atom } from 'recoil';

export type FilterState = {
  venueText?: string;
  masterTaskText?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
  scrollToDate?: string;
  productionStartDate?: Date;
  productionEndDate?: Date;
};

export const intialBookingFilterState: FilterState = {
  venueText: '',
  masterTaskText: '',
  status: 'all',
  startDate: null,
  endDate: null,
  scrollToDate: '',
  productionStartDate: null,
  productionEndDate: null,
};

export const filterState = atom({
  key: 'filterState',
  default: intialBookingFilterState,
});
