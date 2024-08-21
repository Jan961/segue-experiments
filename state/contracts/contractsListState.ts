import { IContractSummary } from 'interfaces/contracts';
import { atom } from 'recoil';

export type TContractListState = Record<number, IContractSummary>;

const intialState: TContractListState = {};

export const contractListState = atom({
  key: 'contractListState',
  default: intialState,
});
