import { MasterTask } from '@prisma/client';
import { atom } from 'recoil';

export type MasterTaskState = MasterTask[];

const intialState: MasterTaskState = [];

export const masterTaskState = atom({
  key: 'masterTaskState',
  default: intialState,
});