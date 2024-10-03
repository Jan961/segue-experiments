import { MasterTaskDTO } from 'interfaces';
import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getMaxMasterTaskCode } from 'services/TaskService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const task = req.body as MasterTaskDTO;
    const prisma = await getPrismaClient(req);

    const { Code } = await getMaxMasterTaskCode(req);

    const createResult = await prisma.masterTask.create({
      data: {
        Code: Code + 1,
        Name: task.Name,
        Notes: task.Notes,
        TaskAssignedToAccUserId: task.TaskAssignedToAccUserId,
        StartByWeekNum: task.StartByWeekNum,
        CompleteByWeekNum: task.CompleteByWeekNum,
      },
    });

    res.status(200).json(createResult);
  } catch (err) {
    if (err.code === 'P2002' && err.meta && err.meta.target.includes('SECONDARY')) {
      res.status(409).json({ error: 'A show with the specified AccountId and Code already exists.' });
    } else {
      console.log(err);
      res.status(500).json({ error: `Error occurred while creating Show ${err?.message}`, ok: false });
    }
  }
}
