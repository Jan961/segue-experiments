import { MasterTask } from '@prisma/client';
import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getMaxTaskCode } from 'services/TaskService';
import { checkAccess, getEmailFromReq } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const tasks = req.body as MasterTask[];

    if (tasks.length === 0) {
      return res.status(400).json({ error: 'No tasks provided' });
    }

    const email = await getEmailFromReq(req);
    const access = await checkAccess(email);
    if (!access) return res.status(401).end();

    const { Code } = await getMaxTaskCode();

    let updatedCode = Code;

    const createData = tasks.map((task) => {
      updatedCode += updatedCode;
      return {
        Code: updatedCode,
        Name: task.Name,
        Priority: task.Priority,
        Notes: task.Notes,
        AssignedToUserId: task.AssignedToUserId,
        StartByWeekNum: task.StartByWeekNum,
        CompleteByWeekNum: task.CompleteByWeekNum,
      };
    });

    const createResults = await prisma.MasterTask.createMany({
      data: createData,
    });

    res.json({ count: createResults.count });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error creating Master Task' });
  }
}
