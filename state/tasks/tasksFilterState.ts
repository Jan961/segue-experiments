import { atom } from 'recoil';

export type TasksFilterType = {
  production?: number;
  taskText?: string;
  status?: string;
  startDueDate?: Date;
  endDueDate?: Date;
  assignee?: number;
};

export const intialTasksState: TasksFilterType = {
  production: null,
  taskText: '',
  status: 'all',
  startDueDate: null,
  endDueDate: null,
  assignee: -1,
};

export const tasksfilterState = atom({
  key: 'tasksFilterState',
  default: intialTasksState,
});
