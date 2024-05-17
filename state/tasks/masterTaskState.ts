import { atom } from 'recoil';

export type MasterTaskStateType = {
  taskText?: string;
};

export const intialTasksState: MasterTaskStateType = {
  taskText: '',
};

export const masterTaskState = atom({
  key: 'masterTaskState',
  default: intialTasksState,
});
