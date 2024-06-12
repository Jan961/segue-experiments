import { useMemo } from 'react';
import { getFilteredUsers } from './useTasksFilter';
import { useRecoilValue } from 'recoil';
import { masterTaskState } from 'state/tasks/masterTaskState';
import { userState } from 'state/account/userState';

const useMasterTasksFilter = (tasks = []) => {
  const filters = useRecoilValue(masterTaskState);
  const { users } = useRecoilValue(userState);

  const usersList = useMemo(() => {
    return Object.values(users).map(({ Id, FirstName = '', LastName = '' }) => ({
      value: Id,
      text: `${FirstName || ''} ${LastName || ''}`,
    }));
  }, [users]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(({ Name, TaskName, AssignedToUserId, Notes, StartByWeekNum, CompleteByWeekNum }) => {
      return (
        !filters.taskText ||
        [Name, TaskName, Notes, StartByWeekNum, CompleteByWeekNum]
          .map((text) => text?.toLowerCase?.())
          .some((text) => text?.includes?.(filters.taskText.toLowerCase())) ||
        getFilteredUsers(usersList, AssignedToUserId, filters.taskText) ||
        StartByWeekNum.toString() === filters.taskText ||
        CompleteByWeekNum.toString() === filters.taskText
      );
    });
  }, [tasks, filters.taskText, usersList]);

  return { filteredTasks };
};

export default useMasterTasksFilter;
