import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { masterTaskState } from 'state/tasks/masterTaskState';
import { userState } from 'state/account/userState';
import Fuse from 'fuse.js';

const useMasterTasksFilter = (tasks = []) => {
  const filters = useRecoilValue(masterTaskState);
  const { users } = useRecoilValue(userState);

  const usersList = useMemo(() => {
    return Object.values(users).map(({ Id, FirstName = '', LastName = '' }) => ({
      value: Id,
      text: `${FirstName || ''} ${LastName || ''}`,
    }));
  }, [users]);
  const userIdToNameMap = usersList.reduce((acc, user) => {
    acc[user.value] = user.text;
    return acc;
  }, {});

  const fuseOptions = {
    includeScore: true,
    includeMatches: true,
    isCaseSensitive: false,
    shouldSort: true,
    useExtendedSearch: true,
    threshold: 0.3,
    keys: [],
    // keys: ['Name', 'Notes'],
  };

  const filteredTasks = useMemo(() => {
    fuseOptions.keys = ['Name', 'userName'];
    return filters.taskText
      ? new Fuse(
          tasks.map((task) => {
            return {
              ...task,
              userName: task.AssignedToUserId !== -1 ? userIdToNameMap[task.AssignedToUserId] : null,
            };
          }),
          fuseOptions,
        )
          .search(filters.taskText)
          .map((item) => item.item)
      : tasks;
  }, [tasks, filters.taskText]);
  console.log(filteredTasks);
  return { filteredTasks };
};

export default useMasterTasksFilter;
