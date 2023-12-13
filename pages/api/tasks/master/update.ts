import { MasterTask } from '@prisma/client';
import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { loggingService } from 'services/loggingService';
import { getAccountId, getEmailFromReq } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const task = req.body as MasterTask;
    const email = await getEmailFromReq(req);
    const AccountId = await getAccountId(email);
    const result = await prisma.MasterTask.update({
      where:{Id:task.Id},
      data: {...task, AccountId},
    });
    res.status(200).json(result);
  } catch (err) {
    await loggingService.logError(err);
    console.log(err);
    res.status(500).json({ error: 'Error creating Master Task' });
  }
}