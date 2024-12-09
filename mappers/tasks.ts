import { ProductionTaskDTO } from 'interfaces';
import { dateBlockMapper, mapToProductionTaskDTO } from 'lib/mappers';
import { ProductionsWithTasks } from 'state/tasks/productionState';
import { calculateTaskStatus } from 'utils/tasks';

export const mapToProductionTasksDTO = (productionTasks): ProductionsWithTasks[] => {
  return productionTasks.map((t: any) => {
    let db = t.DateBlock.find((block) => block.IsPrimary);
    if (db) {
      db = dateBlockMapper(db);
    }
    return {
      Id: t.Id,
      ShowName: t.Show.Name,
      ShowCode: t.Show.Code,
      ShowId: t.Show.Id,
      Code: t.Code,
      StartDate: db?.StartDate || null,
      EndDate: db?.EndDate || null,
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
    };
  });
};
