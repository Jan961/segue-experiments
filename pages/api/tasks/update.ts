import { ProductionTaskDTO } from 'interfaces';
import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getEmailFromReq, checkAccess } from 'services/userService';
import { productionTaskSchema } from 'validators/tasks';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const task = req.body as ProductionTaskDTO;
      const { Id, PRTId } = task;
      const email = await getEmailFromReq(req);
      const access = await checkAccess(email, { TaskId: Id });
      if (!access) return res.status(401).end();

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
        TaskCompletedDate: new Date(task?.TaskCompletedDate) || null,
        ProductionId: task.ProductionId,
        AssignedToUserId: task.AssignedToUserId,
      };

      await productionTaskSchema.validate(prodTaskRecord);
      const updatedTask = await prisma.ProductionTask.update({
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
          TaskCompletedDate: new Date(task?.TaskCompletedDate) || null,
          ...(task.ProductionId && {
            Production: {
              connect: {
                Id: task.ProductionId,
              },
            },
          }),
          ...(task.AssignedToUserId && {
            User: {
              connect: {
                Id: task.AssignedToUserId,
              },
            },
          }),
          ProductionTaskRepeat: { disconnect: true },
        },
      });
      await prisma.ProductionTaskRepeat.delete({ where: { Id: PRTId } });
      return res.status(200).json(updatedTask);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Error updating ProductionTask' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
