import { atom } from 'recoil';

export type FilterState = {
  venueText?: string;
};

const intialState: FilterState = {
  venueText: '',
};

export const filterState = atom({
  key: 'filterState',
  default: intialState,
});
