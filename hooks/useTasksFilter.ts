import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { tasksfilterState } from 'state/tasks/tasksFilterState';
import { productionState } from 'state/tasks/productionState';
import { calculateTaskStatus } from 'utils/tasks';
import { isThisWeek } from 'date-fns';
import { userState } from 'state/account/userState';

const generateOptions = (weekData) => {
  return Object.entries(weekData).map(([key]) => ({
    text: key,
    value: parseInt(key),
  }));
};

const getStatusBool = (taskStatus, filterStatus, taskDueDate) => {
  const dueDate = new Date(taskDueDate);
  const today = new Date();
  switch (filterStatus) {
    case 'inProgressandtodo':
      return taskStatus === 'todo' || taskStatus === 'inProgress';
    case 'dueThisWeek':
      return isThisWeek(dueDate);
    case 'overdue':
      return dueDate < today;
    case 'overdueanddueThisWeek':
      return isThisWeek(dueDate) || dueDate < today;
    default:
      return true;
  }
};

const useTasksFilter = () => {
  const productions = useRecoilValue(productionState);
  const filters = useRecoilValue(tasksfilterState);
  const { users } = useRecoilValue(userState);

  const usersList = useMemo(() => {
    return Object.values(users).map(({ Id, FirstName = '', LastName = '' }) => ({
      value: Id,
      text: `${FirstName || ''} ${LastName || ''}`,
    }));
  }, [users]);

  const filteredProductions = useMemo(() => {
    return productions
      .filter((productionItem) => {
        if (filters.production === -1) return productionItem.Tasks;
        return productionItem.Id === filters.production;
      })
      .map((productionData) => {
        return {
          ...productionData,
          Tasks: productionData.Tasks.filter(
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
                  [Name, TaskName, Notes]
                    .map((text) => text?.toLowerCase?.())
                    .some((text) => text?.includes?.(filters.taskText.toLowerCase())) ||
                  getFilteredUsers(usersList, AssignedToUserId, filters.taskText))
              );
            },
          ).map((task) => ({
            ...task,
            Status: calculateTaskStatus(task.Progress || 0),
            weekOptions: generateOptions(productionData.weekNumToDateMap),
          })),
        };
      });
  }, [
    productions,
    filters.production,
    filters.assignee,
    filters.endDueDate,
    filters.startDueDate,
    filters.status,
    filters.taskText,
    usersList,
  ]);

  return { filteredProductions };
};

const getFilteredUsers = (usersList, userId, filterText) => {
  const user = usersList.find(({ value }) => value === userId);
  if (user && user.text) return user?.text?.toLowerCase?.().includes?.(filterText.toLowerCase());
};

export default useTasksFilter;
