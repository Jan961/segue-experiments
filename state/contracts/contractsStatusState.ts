import { ContractStatusType, ContractBookingStatusType } from 'interfaces';
import { atom } from 'recoil';

export type ContractsStatusState = Record<number, ContractStatusType>;

export const contractsStatusState = atom({
  key: 'contractsStatusState',
  default: {} as ContractsStatusState,
});

export type ContractsBookingStatusState = Record<number, ContractBookingStatusType>;

export const contractsBookingStatusState = atom({
  key: 'contractsBookingStatusState',
  default: {} as ContractsBookingStatusState,
});
