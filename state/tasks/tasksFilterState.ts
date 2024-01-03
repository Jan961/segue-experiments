import { atom } from 'recoil';

export type TasksFilterType = {
  tour?: number;
  taskText?: string;
  status?: string;
  startDueDate?: string;
  endDueDate?: string;
  assignee?: number;
};

const intialState: TasksFilterType = {
  tour:null,
  taskText: '',
  status: null,
  startDueDate: '',
  endDueDate: '',
  assignee: null,
};

export const tasksfilterState = atom({
  key: 'tasksFilterState',
  default: intialState,
});
