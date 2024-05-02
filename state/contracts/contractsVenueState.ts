import { VenueMinimalDTO } from 'interfaces';
import { atom } from 'recoil';

export type ContractsVenueState = Record<number, VenueMinimalDTO>;

const intialState: ContractsVenueState = {};

export const contractsVenueState = atom({
  key: 'contractsVenueState',
  default: intialState,
});
