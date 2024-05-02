import { DateBlockDTO } from 'interfaces';
import { atom } from 'recoil';

export type ContractsDateBlockState = DateBlockDTO[];

const intialState: ContractsDateBlockState = [];

export const contractsDateBlockState = atom({
  key: 'contractsDateBlockState',
  default: intialState,
});
