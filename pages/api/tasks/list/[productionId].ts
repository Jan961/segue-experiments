import { mapToProductionTasksDTO } from 'mappers/tasks';
import { NextApiRequest, NextApiResponse } from 'next';
import { loggingService } from 'services/loggingService';
import { getProductionsAndTasks } from 'services/productionService';
import { ProductionsWithTasks } from 'state/tasks/productionState';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const ProductionId = req.query.productionId.toString();
    const productionsWithTasks = await getProductionsAndTasks(req, parseInt(ProductionId));
    const productions: ProductionsWithTasks[] = mapToProductionTasksDTO(productionsWithTasks);

    res.status(200).json(productions);
  } catch (err) {
    await loggingService.logError(err);
    console.log(err);
    res.status(500).json({ error: 'Error fetching Master Task' });
  }
}
