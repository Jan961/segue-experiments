import { mapToProductionTasksDTO } from 'mappers/tasks';
import { NextApiRequest, NextApiResponse } from 'next';
import { loggingService } from 'services/loggingService';
import { getProductionsAndTasks } from 'services/productionService';
import { getAccountId, getEmailFromReq } from 'services/userService';
import { ProductionsWithTasks } from 'state/tasks/productionState';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const email = await getEmailFromReq(req);
    const AccountId = await getAccountId(email);
    const ProductionId = req.query.productionId.toString();
    const productionsWithTasks = await getProductionsAndTasks(AccountId, parseInt(ProductionId));
    const productions: ProductionsWithTasks[] = mapToProductionTasksDTO(productionsWithTasks);

    res.status(200).json(productions);
  } catch (err) {
    await loggingService.logError(err);
    console.log(err);
    res.status(500).json({ error: 'Error fetching Master Task' });
  }
}
