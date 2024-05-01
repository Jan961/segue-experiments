import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { tasksfilterState } from 'state/tasks/tasksFilterState';
import { productionState } from 'state/tasks/productionState';
import { calculateTaskStatus } from 'utils/tasks';

const useTasksFilter = () => {
  const productions = useRecoilValue(productionState);
  const filters = useRecoilValue(tasksfilterState);

  const filteredProductions = useMemo(() => {
    const selectedProductionData = productions.filter((productionItem) => {
      if (filters.production === -1) return productionItem.Tasks
      else if (productionItem.Id === filters.production) return productionItem
    })

    const selectedProductions = selectedProductionData.map((productionData) => {
      const filteredTasks = productionData.Tasks.filter(({ Name, TaskName, Progress, DueDate, AssignedToUserId, Notes }) => {
        const Status = calculateTaskStatus(Progress || 0);
        return (
          (!filters.endDueDate || new Date(DueDate) <= filters.endDueDate) &&
          (!filters.startDueDate || new Date(DueDate) >= filters.startDueDate) &&
          (filters.status === 'all' || Status === filters.status) &&
          (filters.assignee === -1 || AssignedToUserId === filters.assignee) &&
          (!filters.taskText ||
            Name?.toLowerCase?.().includes?.(filters.taskText?.toLowerCase()) ||
            TaskName?.toLowerCase?.().includes?.(filters.taskText?.toLowerCase()) ||
            Notes?.toLowerCase?.().includes?.(filters.taskText?.toLowerCase()))
        );
      }).map(task => ({
        ...task,
        Status: calculateTaskStatus(task.Progress || 0)
      }));
      return { ...productionData, Tasks: [...filteredTasks] }
    })
    return selectedProductions;
  }, [productions, filters.production, filters.assignee, filters.endDueDate, filters.startDueDate, filters.status, filters.taskText]) || [];

  return { filteredProductions };
};

export default useTasksFilter;
