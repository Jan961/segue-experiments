import { atom } from 'recoil';
import { DateDistancesDTO } from 'services/venueService';

export type DistanceState = {
  stops: DateDistancesDTO[];
  outdated: boolean;
  productionCode?: string;
};

const intialState: DistanceState = {
  stops: [],
  outdated: true,
  productionCode: undefined,
};

export const distanceState = atom({
  key: 'distanceState',
  default: intialState,
});
