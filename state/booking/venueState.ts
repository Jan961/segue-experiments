import { VenueMinimalDTO } from 'interfaces';
import { atom } from 'recoil';

export type VenueState = Record<number, VenueMinimalDTO>;

const intialState: VenueState = {};

export const venueState = atom({
  key: 'venueState',
  default: intialState,
});
