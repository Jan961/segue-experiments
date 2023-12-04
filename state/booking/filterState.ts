import { atom } from 'recoil';

export type FilterState = {
  venueText?: string;
  masterTaskText?: string;
};

const intialState: FilterState = {
  venueText: '',
  masterTaskText:'',
};

export const filterState = atom({
  key: 'filterState',
  default: intialState,
});
