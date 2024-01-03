import { MasterTask } from '@prisma/client';
import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getMaxTaskCode } from 'services/TaskService';
import { getAccountId, getEmailFromReq } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const task = req.body as MasterTask;
    const email = await getEmailFromReq(req);
    const AccountId = await getAccountId(email);
    const { Code } = await getMaxTaskCode();
    const createResult = await prisma.MasterTask.create({
      data: { ...task, AccountId, Code: Code + 1 },
    });
    res.json(createResult);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error creating Master Task' });
  }
}
