import { ProductionTaskDTO } from 'interfaces';
import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getMaxProductionTaskCode } from 'services/TaskService';
import { getEmailFromReq, checkAccess } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const tasks = req.body as ProductionTaskDTO[];

    if (tasks.length === 0) {
      return res.status(400).json({ error: 'No tasks provided' });
    }

    const { ProductionId } = tasks[0];

    const email = await getEmailFromReq(req);
    const access = await checkAccess(email, { ProductionId });
    if (!access) return res.status(401).end();

    // Validate that all tasks have the same ProductionId
    for (const task of tasks) {
      if (task.ProductionId !== ProductionId) {
        return res.status(400).json({ error: 'All tasks must have the same ProductionId' });
      }
    }

    const { Code } = await getMaxProductionTaskCode(ProductionId);

    let updatedCode = Code;

    const createData = tasks.map((task) => {
      updatedCode += 1;
      return {
        ProductionId: task.ProductionId,
        Code: updatedCode,
        Name: task.Name,
        Priority: task.Priority,
        Notes: task.Notes,
        Progress: task.Progress,
        AssignedToUserId: task.AssignedToUserId,
        StartByWeekNum: task.StartByWeekNum,
        CompleteByWeekNum: task.CompleteByWeekNum,
        StartByIsPostProduction: task.StartByIsPostProduction,
        CompleteByIsPostProduction: task.CompleteByIsPostProduction,
      };
    });

    const createResults = await prisma.productionTask.createMany({
      data: createData,
    });

    res.json({ count: createResults.count });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error creating ProductionTasks' });
  }
}
