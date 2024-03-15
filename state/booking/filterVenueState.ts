import { atom } from 'recoil';

export type FilterVenueState = {
  venueId?: number;
  masterTaskText?: string;
  town?: string;
  country?: string;
  productionId?: number;
  Name?: string;
};

export const intialVenueFilterState: FilterVenueState = {
  venueId: null,
  Name: '',
  masterTaskText: '',
  town: '',
  country: '',
  productionId: null,
};

export const filterVenueState = atom({
  key: 'filterVenueState',
  default: intialVenueFilterState,
});
