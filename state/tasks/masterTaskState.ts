import { MasterTask } from '@prisma/client';
import { atom } from 'recoil';

export type MasterTaskStateType = MasterTask[];

const intialState: MasterTaskStateType = [];

export const masterTaskState = atom({
  key: 'masterTaskState',
  default: intialState,
});