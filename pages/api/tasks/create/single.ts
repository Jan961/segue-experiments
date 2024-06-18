// import { generateProductionTaskId } from 'components/tasks/utils';
import { ProductionTaskDTO } from 'interfaces';
import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
// import { getMaxProductionTaskCode } from 'services/TaskService';
import { getEmailFromReq, checkAccess } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const task = req.body as ProductionTaskDTO;
    const { ProductionId } = task;

    const email = await getEmailFromReq(req);
    const access = await checkAccess(email, { ProductionId });
    if (!access) return res.status(401).end();

    // const { Code } = await getMaxProductionTaskCode(ProductionId);

    // const codeGenerated = generateProductionTaskId(Code, Code);

    const createResult = await prisma.productionTask.create({
      data: {
        ProductionId: task.ProductionId,
        Code: task.Code,
        Name: task.Name,
        Priority: task.Priority,
        Notes: task.Notes,
        Progress: task.Progress,
        AssignedToUserId: task.AssignedToUserId,
        StartByWeekNum: task.StartByWeekNum,
        CompleteByWeekNum: task.CompleteByWeekNum,
        StartByIsPostProduction: task.StartByIsPostProduction,
        CompleteByIsPostProduction: task.CompleteByIsPostProduction,
      },
    });

    res.json(createResult);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error creating ProductionTask' });
  }
}
