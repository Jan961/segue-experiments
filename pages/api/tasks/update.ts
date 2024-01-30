import { ProductionTaskDTO } from 'interfaces';
import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getEmailFromReq, checkAccess } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const task = req.body as ProductionTaskDTO;
      const { Id } = task;

      const email = await getEmailFromReq(req);
      const access = await checkAccess(email, { TaskId: Id });
      if (!access) return res.status(401).end();

      const updatedTask = await prisma.ProductionTask.update({
        where: { Id: task.Id },
        data: {
          Name: task.Name,
          Code: task.Code,
          Priority: task.Priority,
          Notes: task.Notes,
          Progress: task.Progress,
          Interval: 'once',
          StartByWeekNum: task.StartByWeekNum,
          CompleteByWeekNum: task.CompleteByWeekNum,
          StartByIsPostProduction: task.StartByIsPostProduction,
          CompleteByIsPostProduction: task.CompleteByIsPostProduction,
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
