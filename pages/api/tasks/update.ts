import { TourTaskDTO } from 'interfaces';
import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getEmailFromReq, checkAccess } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const task = req.body as TourTaskDTO;
      const { Id } = task;

      const email = await getEmailFromReq(req);
      const access = await checkAccess(email, { TaskId: Id });
      if (!access) return res.status(401).end();

      await prisma.TourTask.update({
        where: { Id: task.Id },
        data: {
          Name: task.Name,
          Code: task.Code,
          Priority: task.Priority,
          Notes: task.Notes,
          Progress: task.Progress,
          Interval: 'once',
          AssignedToUserId: task.AssignedTo,
          StartByWeekNum: task.StartByWeekNum,
          CompleteByWeekNum: task.CompleteByWeekNum,
          StartByPostTour: task.StartByPostTour,
          CompleteByPostTour: task.CompleteByPostTour,
          Tour: {
            connect: {
              Id: task.TourId,
            },
          },
        },
      });

      return res.status(200).json({});
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Error updating TourTask' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
