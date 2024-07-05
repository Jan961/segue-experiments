import { atom } from 'recoil';

export type GlobalActivityFilterState = {
  searchText?: string;
  startDate?: Date;
  endDate?: Date;
};

export const intialGbaFilterState: GlobalActivityFilterState = {
  searchText: '',
  startDate: null,
  endDate: null,
};

export const filterState = atom({
  key: 'globalActivityFilterState',
  default: intialGbaFilterState,
});
