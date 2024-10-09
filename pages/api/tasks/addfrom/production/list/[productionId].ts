import { mapToProductionTasksDTO } from 'mappers/tasks';
import { NextApiRequest, NextApiResponse } from 'next';
import { loggingService } from 'services/loggingService';
import { getProductionsAndTasks } from 'services/productionService';
import { ProductionsWithTasks } from 'state/tasks/productionState';
import { isNullOrEmpty } from 'utils';
import { sortProductionTasksByDueAndAlpha } from 'utils/tasks';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const ProductionId = req.query.productionId.toString();
    const productionsWithTasks = await getProductionsAndTasks(req, parseInt(ProductionId));
    const productions: ProductionsWithTasks[] = mapToProductionTasksDTO(productionsWithTasks);
    const compressedTasks = productions.map((production) => {
      const taskList = [];
      const ptrList = [];
      production.Tasks.forEach((task) => {
        if (!isNullOrEmpty(task.PRTId)) {
          if (!ptrList.includes(task.PRTId)) {
            taskList.push(task);
            ptrList.push(task.PRTId);
          }
        } else {
          taskList.push(task);
        }
      });
      return { ...production, Tasks: taskList };
    });

    res.status(200).json(sortProductionTasksByDueAndAlpha(compressedTasks));
  } catch (err) {
    await loggingService.logError(err);
    console.log(err);
    res.status(500).json({ error: 'Error fetching Master Task' });
  }
}
