import { DateTypeDTO } from 'interfaces';
import { atom } from 'recoil';

export type ContractsDateTypeState = DateTypeDTO[];

const intialState: ContractsDateTypeState = [];

export const contractsDateTypeState = atom({
  key: 'contractsDateTypeState',
  default: intialState,
});
