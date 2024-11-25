import { ProductionTaskDTO } from 'interfaces';
import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { productionTaskSchema } from 'validators/tasks';
import { isNullOrEmpty } from 'utils';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const task = req.body as ProductionTaskDTO;
      const prisma = await getPrismaClient(req);

      const prodTaskRecord = {
        Name: task.Name,
        Code: task.Code,
        Priority: task.Priority,
        Notes: task.Notes,
        Progress: task.Progress,
        StartByWeekNum: task.StartByWeekNum,
        CompleteByWeekNum: task.CompleteByWeekNum,
        StartByIsPostProduction: task.StartByIsPostProduction,
        CompleteByIsPostProduction: task.CompleteByIsPostProduction,
        TaskCompletedDate: !isNullOrEmpty(task?.TaskCompletedDate) ? task?.TaskCompletedDate : null,
        ProductionId: task.ProductionId,
        TaskAssignedToAccUserId: task.TaskAssignedToAccUserId,
      };

      await productionTaskSchema.validate(prodTaskRecord);
      const updatedTask = await prisma.productionTask.update({
        where: { Id: task.Id },
        data: {
          Name: task.Name,
          Code: task.Code,
          Priority: task.Priority,
          Notes: task.Notes,
          Progress: task.Progress,
          StartByWeekNum: task.StartByWeekNum,
          CompleteByWeekNum: task.CompleteByWeekNum,
          StartByIsPostProduction: task.StartByIsPostProduction,
          CompleteByIsPostProduction: task.CompleteByIsPostProduction,
          TaskCompletedDate: !isNullOrEmpty(task?.TaskCompletedDate) ? task?.TaskCompletedDate : null,
          ...(task.ProductionId && {
            Production: {
              connect: {
                Id: task.ProductionId,
              },
            },
          }),
          ...(task.TaskAssignedToAccUserId && {
            TaskAssignedToAccUserId: task.TaskAssignedToAccUserId,
          }),
          ...(task.PRTId && {
            ProductionTaskRepeat: {
              connect: {
                Id: task.PRTId,
              },
            },
          }),
        },
      });
      return res.status(200).json(updatedTask);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Error updating ProductionTask' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
