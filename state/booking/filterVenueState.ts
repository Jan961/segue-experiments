import { atom } from 'recoil';

export type FilterVenueState = {
  venueId?: number;
  masterTaskText?: string;
  town?: string;
  country?: string;
};

export const intialVenueFilterState: FilterVenueState = {
  venueId: null,
  masterTaskText: '',
  town: '',
  country: '',
};

export const filterVenueState = atom({
  key: 'filterVenueState',
  default: intialVenueFilterState,
});
