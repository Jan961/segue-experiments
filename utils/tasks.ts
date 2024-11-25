import { SelectOption } from 'components/global/forms/FormInputSelect';
import { TasksFilterType } from 'state/tasks/tasksFilterState';
import { ProductionsWithTasks } from 'state/tasks/productionState';
import { isNullOrEmpty } from './index';
import { UTCDate } from '@date-fns/utc';

export const priorityOptions: SelectOption[] = [
  { text: 'Immediate', value: 1 },
  { text: 'Very Urgent', value: 2 },
  { text: 'Urgent', value: 3 },
  { text: 'Normal', value: 4 },
  { text: 'Low Priority', value: 5 },
];

export const filterProductionTasksBySearchText = (
  productionsWithTasks: ProductionsWithTasks[],
  searchText: string,
): ProductionsWithTasks[] => {
  const results = [];
  for (const productionWithTasks of productionsWithTasks) {
    const filteredTasks = productionWithTasks.Tasks.filter(
      (Task) => Task?.Name?.toLocaleLowerCase?.().includes(searchText?.toLocaleLowerCase?.()),
    );
    if (filteredTasks.length > 0) {
      results.push({ ...productionWithTasks, Tasks: filteredTasks });
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

export const applyTaskFilters = (
  productionsWithTasks: ProductionsWithTasks[],
  filters: TasksFilterType,
): ProductionsWithTasks[] => {
  const results = [];
  for (const productionWithTasks of productionsWithTasks) {
    const filteredTasks = productionWithTasks.Tasks.filter((task) => {
      let matches = true;
      if (filters.taskText && !task.Name.includes(filters.taskText)) {
        matches = false;
      }
      if (filters.status && filters.status !== 'all' && calculateTaskStatus(task.Progress) !== filters.status) {
        matches = false;
      }
      const taskDueDate = productionWithTasks.weekNumToDateMap?.[task.CompleteByWeekNum];
      if (filters.startDueDate && new UTCDate(taskDueDate) < new UTCDate(filters.startDueDate)) {
        matches = false;
      }
      if (filters.endDueDate && new UTCDate(taskDueDate) > new UTCDate(filters.endDueDate)) {
        matches = false;
      }
      if (filters.assignee && task.TaskAssignedToAccUserId !== filters.assignee) {
        matches = false;
      }
      return matches;
    });
    if (filteredTasks.length > 0) {
      results.push({ ...productionWithTasks, Tasks: filteredTasks });
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

export const sortProductionTasksByDueAndAlpha = (taskList: any[]) => {
  return taskList.map((production) => {
    return {
      ...production,
      Tasks: sortTasksByDueAndAlpha(production.Tasks),
    };
  });
};

export const sortTasksByDueAndAlpha = (taskList: any[]) => {
  const noStartWeeks = [];
  const validTasks = [];
  taskList.forEach((task) => {
    if (isNullOrEmpty(task.StartByWeekNum)) {
      noStartWeeks.push(task);
    } else {
      validTasks.push(task);
    }
  });

  return [
    ...noStartWeeks.sort((a, b) => a.Name.localeCompare(b.Name)),
    ...validTasks.sort((a, b) => {
      if (a.StartByWeekNum === b.StartByWeekNum) {
        return a.Name.localeCompare(b.Name);
      }
      return a.StartByWeekNum - b.StartByWeekNum;
    }),
  ];
};

export const generatePercentageOptions = [0, 25, 50, 75, 100].map((value) => ({
  text: value.toString(),
  value: value.toString(),
}));
