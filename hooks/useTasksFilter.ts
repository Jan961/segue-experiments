import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { tasksfilterState } from 'state/tasks/tasksFilterState';
import { productionState } from 'state/tasks/productionState';
import { calculateTaskStatus } from 'utils/tasks';
import { isThisWeek } from 'date-fns';
import { userState } from 'state/account/userState';
import { productionJumpState } from 'state/booking/productionJumpState';

const generateOptions = (weekData) => {
  return Object.entries(weekData).map(([key]) => ({
    text: key,
    value: parseInt(key),
  }));
};

export const getStatusBool = (taskStatus: string, filterStatus: string, taskDueDate: string) => {
  const dueDate = new Date(taskDueDate);
  const today = new Date();
  console.log(filterStatus, taskStatus);
  switch (filterStatus) {
    case 'inProgress':
    case 'complete':
    case 'todo':
      return taskStatus === filterStatus;
    case 'inProgressandtodo':
      return taskStatus === 'todo' || taskStatus === 'inProgress';
    case 'dueThisWeek':
      return isThisWeek(dueDate);
    case 'overdue':
      return dueDate < today && taskStatus !== 'complete';
    case 'overdueanddueThisWeek':
      return isThisWeek(dueDate) || (dueDate < today && taskStatus !== 'complete');
    default:
      return true;
  }
};

const useTasksFilter = () => {
  const productions = useRecoilValue(productionState);
  const { selected } = useRecoilValue(productionJumpState);
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
        if (selected === -1) return productionItem.Tasks;
        return productionItem.Id === selected;
      })
      .map((productionData) => {
        return {
          ...productionData,
          Tasks: productionData.Tasks.filter(({ Name, TaskName, AssignedToUserId, Notes, CompleteDate, Status }) => {
            return (
              (!filters.endDueDate || new Date(CompleteDate) < new Date(filters.endDueDate)) &&
              (!filters.startDueDate || new Date(CompleteDate) > new Date(filters.startDueDate)) &&
              (!filters.status || filters.status === 'all' || getStatusBool(Status, filters.status, CompleteDate)) &&
              (filters.assignee === -1 || AssignedToUserId === filters.assignee) &&
              (!filters.taskText ||
                [Name, TaskName, Notes]
                  .map((text) => text?.toLowerCase?.())
                  .some((text) => text?.includes?.(filters.taskText.toLowerCase())) ||
                getFilteredUsers(usersList, AssignedToUserId, filters.taskText))
            );
          }).map((task) => ({
            ...task,
            Status: calculateTaskStatus(task.Progress || 0),
            weekOptions: generateOptions(productionData.weekNumToDateMap),
          })),
        };
      });
  }, [
    productions,
    selected,
    filters.assignee,
    filters.endDueDate,
    filters.startDueDate,
    filters.status,
    filters.taskText,
    usersList,
  ]);

  return { filteredProductions };
};

export const getFilteredUsers = (usersList, userId, filterText) => {
  const user = usersList.find(({ value }) => value === userId);
  if (user && user.text) return user?.text?.toLowerCase?.().includes?.(filterText.toLowerCase());
};

export default useTasksFilter;
