import { SelectOption } from 'components/global/forms/FormInputSelect';
import { TasksFilterType } from 'state/tasks/tasksFilterState';
import { ToursWithTasks } from 'state/tasks/tourState';

export const priorityOptions: SelectOption[] = [
  { text: 'Immediate', value: 1 },
  { text: 'Very Urgent', value: 2 },
  { text: 'Urgent', value: 3 },
  { text: 'Normal', value: 4 },
  { text: 'Low Priority', value: 5 },
];

export const filterTourTasksBySearchText = (toursWithTasks: ToursWithTasks[], searchText: string): ToursWithTasks[] => {
  const results = [];
  for (const tourWithTasks of toursWithTasks) {
    const filteredTasks = tourWithTasks.Tasks.filter(
      (Task) => Task?.Name?.toLocaleLowerCase?.().includes(searchText?.toLocaleLowerCase?.()),
    );
    if (filteredTasks.length > 0) {
      results.push({ ...tourWithTasks, Tasks: filteredTasks });
    }
  }
  return results;
};

export const calculateTaskStatus = (progress: number): string => {
  if (progress === 0) {
    return 'todo';
  } else if (progress > 0 && progress < 100) {
    return 'inProgress';
  } else if (progress === 100) {
    return 'complete';
  }
  return '';
};

export const applyTaskFilters = (toursWithTasks: ToursWithTasks[], filters: TasksFilterType): ToursWithTasks[] => {
  const results = [];
  console.log('====', filters);
  for (const tourWithTasks of toursWithTasks) {
    const filteredTasks = tourWithTasks.Tasks.filter((task) => {
      let matches = true;
      if (filters.taskText && !task.Name.includes(filters.taskText)) {
        matches = false;
      }
      if (filters.status && filters.status !== 'all' && calculateTaskStatus(task.Progress) !== filters.status) {
        matches = false;
      }
      const taskDueDate = tourWithTasks.weekNumToDateMap?.[task.CompleteByWeekNum];
      if (filters.startDueDate && new Date(taskDueDate) < new Date(filters.startDueDate)) {
        matches = false;
      }
      if (filters.endDueDate && new Date(taskDueDate) > new Date(filters.endDueDate)) {
        matches = false;
      }
      if (filters.assignee && task.AssignedToUserId !== filters.assignee) {
        matches = false;
      }
      return matches;
    });
    if (filteredTasks.length > 0) {
      results.push({ ...tourWithTasks, Tasks: filteredTasks });
    }
  }
  return results;
};

export const getPriority = (priority) => {
  switch (priority) {
    case 0:
      return 'low';
    case 1:
      return 'Medium';
    case 2:
      return 'High';
    default:
      break;
  }
};
