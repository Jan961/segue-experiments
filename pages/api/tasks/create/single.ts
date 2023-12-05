import { TourTaskDTO } from 'interfaces';
import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getEmailFromReq, checkAccess } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const task = req.body as TourTaskDTO;
    const { TourId } = task;

    const email = await getEmailFromReq(req);
    const access = await checkAccess(email, { TourId });
    if (!access) return res.status(401).end();

    const createResult = await prisma.tourTask.create({
      data: {
        TourId: task.TourId,
        Code: task.Code,
        Name: task.Name,
        Priority: task.Priority,
        Notes: task.Notes,
        Progress: task.Progress,
        Interval: 'once',
        AssignedToUserId: task.AssignedTo,
        StartByWeekNum: task.StartByWeekNum,
        CompleteByWeekNum: task.CompleteByWeekNum,
        StartByPostTour: task.StartByPostTour,
        CompleteByPostTour: task.CompleteByPostTour,
      },
    });

    res.json(createResult);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error creating TourTask' });
  }
}
