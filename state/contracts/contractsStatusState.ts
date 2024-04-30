import { ContractStatusType } from 'interfaces';
import { atom } from 'recoil';

export type ContractsStatusState = Record<number, ContractStatusType>;

export const contractsStatusState = atom({
  key: 'contractsStatusState',
  default: {} as ContractsStatusState,
});
