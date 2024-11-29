import { UTCDate } from '@date-fns/utc';
import { atom } from 'recoil';

export type GlobalActivityFilterState = {
  searchText?: string;
  startDate?: UTCDate;
  endDate?: UTCDate;
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
