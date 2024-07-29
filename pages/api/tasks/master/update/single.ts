import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { checkAccess, getEmailFromReq } from 'services/userService';
import { MasterTaskDTO } from 'interfaces';
import { omit } from 'radash';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    let task = req.body as MasterTaskDTO;
    const email = await getEmailFromReq(req);
    const access = await checkAccess(email);
    if (!access) return res.status(401).end();
    const { Id, AssignedToUserId, MTRId } = task;

    task = omit(task, ['Id', 'AccountId', 'AssignedToUserId', 'MTRId', 'MasterTaskRepeat']);
    const createResult = await prisma.MasterTask.update({
      data: {
        ...task,
        ...(task.AssignedToUserId && {
          User: {
            connect: {
              Id: AssignedToUserId,
            },
          },
        }),
        MTRId,
      },
      where: { Id },
    });
    res.status(200).json(createResult);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error creating Master Task' });
  }
}
