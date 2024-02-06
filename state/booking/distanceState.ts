import { atom } from 'recoil';
import { DateDistancesDTO } from 'services/venueService';

type ProductionDistanceState = {
  stops?: DateDistancesDTO[];
  outdated?: boolean;
  productionCode?: string;
};

export type DistanceState = Record<number | string, ProductionDistanceState>;

const intialState: DistanceState = {};

export const distanceState = atom({
  key: 'distanceState',
  default: intialState,
});
