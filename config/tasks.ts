import { SelectOption } from 'components/global/forms/FormInputSelect';

export const statusOptions: SelectOption[] = [
  { text: 'All', value: 'all' },
  { text: 'To do', value: 'todo' },
  { text: 'In Progress', value: 'inProgress' },
  { text: 'In Progress and To Do', value: 'inProgressandtodo' },
  { text: 'Complete', value: 'complete' },
  { text: 'Overdue', value: 'overdue' },
  { text: 'Due this week', value: 'dueThisWeek' },
  { text: 'Overdue and Due this Week', value: 'overdueanddueThisWeek' },
];

export const TaskStatusLabelMap = {
  todo: 'ToDo',
  inProgress: 'Ongoing',
  complete: 'Complete',
};
