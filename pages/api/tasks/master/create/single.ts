import { MasterTaskDTO } from 'interfaces';
import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getMaxMasterTaskCode } from 'services/TaskService';
import { getEmailFromReq, checkAccess, getAccountIdFromReq } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const task = req.body as MasterTaskDTO;

    const email = await getEmailFromReq(req);
    const AccountId = await getAccountIdFromReq(req);
    const access = await checkAccess(email);
    if (!access) return res.status(401).end();

    console.log(task);
    const { Code } = await getMaxMasterTaskCode();

    const createResult = await prisma.MasterTask.create({
      data: {
        AccountId,
        Code: Code + 1,
        Name: task.Name,
        Notes: task.Notes,
        AssignedToUserId: task.AssignedToUserId,
        StartByWeekNum: task.StartByWeekNum,
        CompleteByWeekNum: task.CompleteByWeekNum,
      },
    });

    res.json(createResult);
  } catch (err) {
    if (err.code === 'P2002' && err.meta && err.meta.target.includes('SECONDARY')) {
      res.status(409).json({ error: 'A show with the specified AccountId and Code already exists.' });
    } else {
      console.log(err);
      res.status(500).json({ error: `Error occurred while creating Show ${err?.message}`, ok: false });
    }
  }
}
