import { ProductionTaskDTO } from 'interfaces';
import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getMaxProductionTaskCode } from 'services/TaskService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const task = req.body as ProductionTaskDTO;
    const { ProductionId } = task;
    const prisma = await getPrismaClient(req);

    const code = await getMaxProductionTaskCode(ProductionId, req);
    const createResult = await prisma.productionTask.create({
      data: {
        ProductionId: task.ProductionId,
        Code: code + 1,
        Name: task.Name,
        Priority: task.Priority,
        Notes: task.Notes,
        Progress: task.Progress,
        TaskAssignedToAccUserId: task.TaskAssignedToAccUserId,
        StartByWeekNum: task.StartByWeekNum,
        CompleteByWeekNum: task.CompleteByWeekNum,
        StartByIsPostProduction: task.StartByIsPostProduction,
        CompleteByIsPostProduction: task.CompleteByIsPostProduction,
      },
    });

    res.status(200).json(createResult);
  } catch (err) {
    if (err.code === 'P2002' && err.meta && err.meta.target.includes('SECONDARY')) {
      res.status(409).json({ error: 'A show with the specified AccountId and Code already exists.' });
    } else {
      res.status(500).json({ error: `Error occurred while creating Show ${err?.message}`, ok: false });
    }
  }
}
