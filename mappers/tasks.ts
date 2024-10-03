import { ProductionTaskDTO } from 'interfaces';
import { mapToProductionTaskDTO } from 'lib/mappers';
import { ProductionsWithTasks } from 'state/tasks/productionState';
import { calculateTaskStatus } from 'utils/tasks';

export const mapToProductionTasksDTO = (productionTasks): ProductionsWithTasks[] => {
  return productionTasks.map((t: any) => ({
    Id: t.Id,
    ShowName: t.Show.Name,
    ShowCode: t.Show.Code,
    ShowId: t.Show.Id,
    Code: t.Code,
    Tasks: t.ProductionTask.map(mapToProductionTaskDTO)
      .map((task: ProductionTaskDTO) => ({
        ...task,
        StartDate: t.WeekNumToDateMap[task.StartByWeekNum],
        CompleteDate: t.WeekNumToDateMap[task.CompleteByWeekNum],
        Status: calculateTaskStatus(task.Progress || 0),
        TaskCompletedDate: task.TaskCompletedDate?.toISOString() || '',
      }))
      .sort((a, b) => a.StartByWeekNum - b.StartByWeekNum),
    weekNumToDateMap: t.WeekNumToDateMap,
  }));
};
