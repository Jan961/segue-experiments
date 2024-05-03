import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { tasksfilterState } from 'state/tasks/tasksFilterState';
import { productionState } from 'state/tasks/productionState';
import { calculateTaskStatus } from 'utils/tasks';
import { SelectOption } from 'components/global/forms/FormInputSelect';
import { isThisWeek } from 'date-fns';
import { userState } from 'state/account/userState';

const generateOptions = (weekData: any) => {
  const optionsData: SelectOption[] = [];
  for (const key in weekData) {
    optionsData.push({
      text: key,
      value: parseInt(key),
    });
  }
  return optionsData;
};

const getStatusBool = (taskStatus, filterStatus, taskDueDate) => {
  const dueDate = new Date(taskDueDate);
  const today = new Date();
  if (filterStatus === 'inProgressandtodo') {
    if (taskStatus === 'todo' || taskStatus === 'inProgress') return true;
    return false;
  } else if (filterStatus === 'dueThisWeek') {
    return isThisWeek(dueDate);
  } else if (filterStatus === 'overdue') {
    return dueDate < today;
  } else if (filterStatus === 'overdueanddueThisWeek') {
    return isThisWeek(dueDate) || dueDate < today;
  }
};

const getFilteredUsers = (usersList, userId, filterText) => {
  const user = usersList.find(({ value }) => value === userId);
  if (user && user.text) return user?.text?.toLowerCase?.().includes?.(filterText.toLowerCase());
};

const useTasksFilter = () => {
  const productions = useRecoilValue(productionState);
  const filters = useRecoilValue(tasksfilterState);

  const { users } = useRecoilValue(userState);

  const usersList = useMemo(
    () =>
      Object.values(users).map(({ Id, FirstName = '', LastName = '' }) => ({
        value: Id,
        text: `${FirstName || ''} ${LastName || ''}`,
      })),
    [users],
  );

  const filteredProductions =
    useMemo(() => {
      const selectedProductionData = productions.filter((productionItem) => {
        if (filters.production === -1) return productionItem.Tasks;
        return productionItem.Id === filters.production;
      });

      const selectedProductions = selectedProductionData.map((productionData) => {
        const filteredTasks = productionData.Tasks.filter(
          ({ Name, TaskName, Progress, AssignedToUserId, Notes, CompleteByWeekNum, CompleteDate }) => {
            const taskDueDate = productionData.weekNumToDateMap?.[CompleteByWeekNum];
            const Status = calculateTaskStatus(Progress || 0);
            return (
              (!filters.endDueDate || new Date(taskDueDate) > new Date(filters.endDueDate)) &&
              (!filters.startDueDate || new Date(taskDueDate) < new Date(filters.startDueDate)) &&
              (filters.status === 'all' ||
                Status === filters.status ||
                getStatusBool(Status, filters.status, CompleteDate)) &&
              (filters.assignee === -1 || AssignedToUserId === filters.assignee) &&
              (!filters.taskText ||
                Name?.toLowerCase?.().includes?.(filters.taskText?.toLowerCase()) ||
                TaskName?.toLowerCase?.().includes?.(filters.taskText?.toLowerCase()) ||
                Notes?.toLowerCase?.().includes?.(filters.taskText?.toLowerCase()) ||
                getFilteredUsers(usersList, AssignedToUserId, filters.taskText))
            );
          },
        ).map((task) => ({
          ...task,
          Status: calculateTaskStatus(task.Progress || 0),
          weekOptions: generateOptions(productionData.weekNumToDateMap),
        }));
        return { ...productionData, Tasks: [...filteredTasks] };
      });
      return selectedProductions;
    }, [
      productions,
      filters.production,
      filters.assignee,
      filters.endDueDate,
      filters.startDueDate,
      filters.status,
      filters.taskText,
    ]) || [];

  return { filteredProductions };
};

export default useTasksFilter;
