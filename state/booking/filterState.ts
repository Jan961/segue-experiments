import { atom } from 'recoil';

export type FilterState = {
  venueText?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
};

const intialState: FilterState = {
  venueText: '',
  status: null,
  startDate: '',
  endDate: '',
};

export const filterState = atom({
  key: 'filterState',
  default: intialState,
});
