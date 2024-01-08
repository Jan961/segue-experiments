import { SelectOption } from 'components/global/forms/FormInputSelect';

export const statusOptions: SelectOption[] = [
  { text: 'All', value: 'all' },
  { text: 'To do', value: 'todo' },
  { text: 'Ongoing', value: 'inProgress' },
  { text: 'Complete', value: 'complete' },
];

export const TaskStatusLabelMap = {
  todo: 'ToDo',
  inProgress: 'Ongoing',
  complete: 'Complete',
};
