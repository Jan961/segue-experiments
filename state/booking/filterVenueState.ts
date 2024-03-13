import { atom } from 'recoil';

export type FilterVenueState = {
  venueId?: number;
  masterTaskText?: string;
  town?: string;
  country?: string;
  productionId?: number;
};

export const intialVenueFilterState: FilterVenueState = {
  venueId: null,
  masterTaskText: '',
  town: '',
  country: '',
  productionId: null,
};

export const filterVenueState = atom({
  key: 'filterVenueState',
  default: intialVenueFilterState,
});
