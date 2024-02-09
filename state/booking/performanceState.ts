import { PerformanceDTO } from 'interfaces';
import { atom } from 'recoil';

export type PerformanceState = Record<number, PerformanceDTO>;

export const performanceState = atom({
  key: 'performanceState',
  default: {} as PerformanceState,
});
