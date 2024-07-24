import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { checkAccess, getEmailFromReq } from 'services/userService';
import { MasterTaskDTO } from 'interfaces';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const task = req.body as MasterTaskDTO;
    const email = await getEmailFromReq(req);
    const access = await checkAccess(email);
    if (!access) return res.status(401).end();
    const createResult = await prisma.MasterTask.update({
      data: { ...task },
      where: { Id: task.Id },
    });
    res.json(createResult);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error creating Master Task' });
  }
}
