import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { tasksfilterState } from 'state/tasks/tasksFilterState';
import { productionState } from 'state/tasks/productionState';
import { calculateTaskStatus } from 'utils/tasks';
import { isThisWeek } from 'date-fns';
import { userState } from 'state/account/userState';
import { productionJumpState } from 'state/booking/productionJumpState';
import { isNullOrEmpty } from 'utils';
import Fuse from 'fuse.js';

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
  const fuseOptions = {
    includeScore: true,
    includeMatches: true,
    isCaseSensitive: false,
    shouldSort: true,
    useExtendedSearch: true,
    threshold: 0.3,
    keys: ['Name', 'Notes'],
  };
  const usersList = useMemo(() => {
    if (isNullOrEmpty(users)) {
      return {};
    }

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
        const productionTasks = filters.taskText
          ? new Fuse(productionData.Tasks, fuseOptions).search(filters.taskText).map((item) => item.item)
          : productionData.Tasks;

        return {
          ...productionData,

          Tasks: productionTasks
            .filter(({ AssignedToUserId, CompleteDate, Status }) => {
              console.log(getFilteredUsers(usersList, AssignedToUserId, filters.taskText));
              console.log('filter ', filters.assignee);
              console.log('assigned', AssignedToUserId);

              return (
                (!filters.endDueDate || new Date(CompleteDate) < new Date(filters.endDueDate)) &&
                (!filters.startDueDate || new Date(CompleteDate) > new Date(filters.startDueDate)) &&
                (!filters.status || filters.status === 'all' || getStatusBool(Status, filters.status, CompleteDate)) &&
                (filters.assignee === -1 ||
                  AssignedToUserId === filters.assignee ||
                  getFilteredUsers(usersList, AssignedToUserId, filters.taskText))
              );
            })
            .map((task) => ({
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

  //  Text fuzzy search
  // let filteredTemp = filteredProductions;
  // const filteredValues = new Fuse(filteredTemp[0].Tasks, fuseOptions);
  // if (filters.taskText) {
  //   const fuseOutput = filteredValues.search(filters.taskText);
  //   filteredTemp[0].Tasks = fuseOutput.map((item) => item.item);
  // }
  // return filteredValues.search(filters.taskText);
  return { filteredProductions };
};

export const getFilteredUsers = (usersList, userId, filterText) => {
  const user = usersList.find(({ value }) => value === userId);
  if (user && user.text) return user?.text?.toLowerCase?.().includes?.(filterText.toLowerCase());
};

export default useTasksFilter;
