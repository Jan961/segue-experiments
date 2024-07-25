import { MasterTaskDTO } from 'interfaces';
import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getEmailFromReq, checkAccess } from 'services/userService';
import { isNullOrEmpty } from 'utils';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const task = req.body as MasterTaskDTO;
      console.log(task);
      const email = await getEmailFromReq(req);
      const access = await checkAccess(email, { TaskId: task.Id });
      if (!access) return res.status(401).end();

      if (task.MTRId && task.RepeatInterval) {
        await prisma.MasterTask.update({
          data: {
            ...task,
          },
          where: {
            Id: task.Id,
          },
        });
      } else if (task.MTRId && isNullOrEmpty(task.RepeatInterval)) {
        console.log('not recurring anymore but was before update');
      }
    } catch (exception) {
      console.log(exception);
    }
    res.status(200).json({});
  }
}
