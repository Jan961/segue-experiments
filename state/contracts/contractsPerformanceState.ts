import { PerformanceDTO } from 'interfaces';
import { atom } from 'recoil';

export type ContractsPerformanceState = Record<number, PerformanceDTO>;

export const contractsPerformanceState = atom({
  key: 'contractsPerformanceState',
  default: {} as ContractsPerformanceState,
});
