import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { tasksfilterState } from 'state/tasks/tasksFilterState';
import { productionState } from 'state/tasks/productionState';
import { calculateTaskStatus } from 'utils/tasks';
import { SelectOption } from 'components/global/forms/FormInputSelect';

const generateOptions = (weekData: any) => {
  const optionsData: SelectOption[] = [];
  for (let key in weekData) {
    optionsData.push({
      text: key,
      value: parseInt(key)
    })
  }
  return optionsData;
}

const getStatusBool = (taskStatus, filterStatus, taskDueDate ) => {
  if (filterStatus === 'inProgressandtodo') {
    if (taskStatus === 'todo' || taskStatus === 'inProgress') return true
    return false;
  }else if(filterStatus === 'overdue'){
    console.log(taskDueDate, filterStatus, taskStatus)
  }
}

const useTasksFilter = () => {
  const productions = useRecoilValue(productionState);
  const filters = useRecoilValue(tasksfilterState);

  const filteredProductions = useMemo(() => {
    const selectedProductionData = productions.filter((productionItem) => {
      if (filters.production === -1) return productionItem.Tasks
      else if (productionItem.Id === filters.production) return productionItem
    })

    const selectedProductions = selectedProductionData.map((productionData) => {
      const filteredTasks = productionData.Tasks.filter(({ Name, TaskName, Progress, AssignedToUserId, Notes, CompleteByWeekNum , DueDate}) => {
        const taskDueDate = productionData.weekNumToDateMap?.[CompleteByWeekNum];
        const Status = calculateTaskStatus(Progress || 0);
        return (
          (!filters.endDueDate || new Date(taskDueDate) > new Date(filters.endDueDate)) &&
          (!filters.startDueDate || new Date(taskDueDate) < new Date(filters.startDueDate)) &&
          (filters.status === 'all' || Status === filters.status || getStatusBool(Status, filters.status, taskDueDate)) &&
          (filters.assignee === -1 || AssignedToUserId === filters.assignee) &&
          (!filters.taskText ||
            Name?.toLowerCase?.().includes?.(filters.taskText?.toLowerCase()) ||
            TaskName?.toLowerCase?.().includes?.(filters.taskText?.toLowerCase()) ||
            Notes?.toLowerCase?.().includes?.(filters.taskText?.toLowerCase()))
            
        );
      }).map(task => ({
        ...task,
        Status: calculateTaskStatus(task.Progress || 0),
        weekOptions: generateOptions(productionData.weekNumToDateMap)
      }));
      return { ...productionData, Tasks: [...filteredTasks] }
    })
    return selectedProductions;
  }, [productions, filters.production, filters.assignee, filters.endDueDate, filters.startDueDate, filters.status, filters.taskText]) || [];

  return { filteredProductions };
};

export default useTasksFilter;
