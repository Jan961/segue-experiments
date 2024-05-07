import { OtherDTO } from 'interfaces';
import { atom } from 'recoil';

export type ContractsOtherState = Record<number, OtherDTO>;

const intialState: ContractsOtherState = {};

export const contractsOtherState = atom({
  key: 'contractsOtherState',
  default: intialState,
});
