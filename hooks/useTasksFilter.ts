import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { tasksfilterState } from 'state/tasks/tasksFilterState';
import { productionState } from 'state/tasks/productionState';
import { calculateTaskStatus, sortProductionTasksByDueAndAlpha } from 'utils/tasks';
import { isThisWeek } from 'date-fns';
import { userState } from 'state/account/userState';
import { productionJumpState } from 'state/booking/productionJumpState';
import { isNullOrEmpty } from 'utils';
import fuseFilter from 'utils/fuseFilter';
import { compareDatesWithoutTime } from 'services/dateService';

const generateOptions = (weekData) => {
  return Object.entries(weekData).map(([key]) => ({
    text: key,
    value: parseInt(key),
  }));
};

export const getStatusBool = (taskStatus: string, filterStatus: string, taskDueDate: string) => {
  const dueDate = new Date(taskDueDate);
  const today = new Date();
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
    if (isNullOrEmpty(users)) {
      return [];
    }

    return Object.values(users).map(({ AccUserId, FirstName = '', LastName = '' }) => ({
      value: AccUserId,
      text: `${FirstName || ''} ${LastName || ''}`,
    }));
  }, [users]);

  const userIdToNameMap = usersList.reduce((acc, user) => {
    acc[user.value] = user.text;
    return acc;
  }, {});

  const filteredProductions = useMemo(() => {
    const filteredTasks = productions
      .filter((productionItem) => {
        if (selected === -1) return productionItem.Tasks;
        return productionItem.Id === selected;
      })
      .map((productionData) => {
        const tasksFilteredByAssignedUser = productionData.Tasks.map((task) => {
          return {
            ...task,
            userName: task.TaskAssignedToAccUserId !== -1 ? userIdToNameMap[task.TaskAssignedToAccUserId] : null,
          };
        });
        const productionTasks = filters.taskText
          ? fuseFilter(tasksFilteredByAssignedUser, filters.taskText, [
              'Name',
              'Notes',
              'userName',
              'StartByWeekNum',
              'CompleteByWeekNum',
            ])
          : productionData.Tasks;
        return {
          ...productionData,

          Tasks: productionTasks
            .filter(({ TaskAssignedToAccUserId, CompleteDate, Status }) => {
              return (
                compareDatesWithoutTime(CompleteDate, filters.endDueDate ? filters.endDueDate : '2250-01-01', '<=') &&
                compareDatesWithoutTime(
                  CompleteDate,
                  filters.startDueDate ? filters.startDueDate : '1990-01-01',
                  '>=',
                ) &&
                (!filters.status || filters.status === 'all' || getStatusBool(Status, filters.status, CompleteDate)) &&
                (filters.assignee === -1 || TaskAssignedToAccUserId === filters.assignee)
              );
            })
            .map((task) => ({
              ...task,
              Status: calculateTaskStatus(task.Progress || 0),
              weekOptions: generateOptions(productionData.weekNumToDateMap),
            })),
        };
      });
    return sortProductionTasksByDueAndAlpha(filteredTasks);
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
