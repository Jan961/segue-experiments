import { MasterTask } from '@prisma/client';
import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getMaxTaskCode } from 'services/TaskService';
import { getAccountId, getEmailFromReq } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const tasks = req.body as MasterTask[];
    const email = await getEmailFromReq(req);
    const AccountId = await getAccountId(email);

    // Get the maximum task code once
    const { Code } = await getMaxTaskCode();

    // Map the tasks to include the AccountId and incremented Code
    const tasksWithAccountAndCode = tasks.map((task, index) => ({
      ...task,
      AccountId,
      Code: Code + 1 + index, // Increment code for each task
    }));

    // Use createMany to insert all tasks at once
    const createResults = await prisma.MasterTask.createMany({
      data: tasksWithAccountAndCode,
    });

    res.json(createResults);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error creating Master Tasks' });
  }
}
