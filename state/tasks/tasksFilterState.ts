import { atom } from 'recoil';

export type TasksFilterType = {
  production?: number;
  taskText?: string;
  status?: string;
  startDueDate?: string;
  endDueDate?: string;
  assignee?: number;
};

const intialState: TasksFilterType = {
  production:null,
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
