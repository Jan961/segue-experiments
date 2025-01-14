import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { masterTaskState } from 'state/tasks/masterTaskState';
import { userState } from 'state/account/userState';
import fuseFilter from '../utils/fuseFilter';
const useMasterTasksFilter = (tasks = []) => {
  const filters = useRecoilValue(masterTaskState);
  const { users } = useRecoilValue(userState);

  const usersList = useMemo(() => {
    return Object.values(users).map(({ AccUserId, FirstName = '', LastName = '' }) => ({
      value: AccUserId,
      text: `${FirstName || ''} ${LastName || ''}`,
    }));
  }, [users]);
  const userIdToNameMap = usersList.reduce((acc, user) => {
    acc[user.value] = user.text;
    return acc;
  }, {});

  const filteredTasks = useMemo(() => {
    const tasksFilteredByAssignedUser = tasks.map((task) => {
      return {
        ...task,
        userName: task.TaskAssignedToAccUserId !== -1 ? userIdToNameMap[task.TaskAssignedToAccUserId] : null,
      };
    });

    return filters.taskText
      ? fuseFilter(tasksFilteredByAssignedUser, filters.taskText, [
          'Name',
          'userName',
          'StartByWeekNum',
          'CompleteByWeekNum',
          'Code',
        ])
      : tasks;
  }, [tasks, filters.taskText]);
  return { filteredTasks };
};

export default useMasterTasksFilter;
