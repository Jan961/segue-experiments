import { MasterTask } from '@prisma/client';
import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getAccountId, getEmailFromReq } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const task = req.body as MasterTask;
    const email = await getEmailFromReq(req);
    const AccountId = await getAccountId(email);
    const createResult = await prisma.MasterTask.create({
      data: {...task, AccountId},
    });

    res.json(createResult);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error creating Master Task' });
  }
}
