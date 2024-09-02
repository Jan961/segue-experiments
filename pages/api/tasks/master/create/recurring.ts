import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getEmailFromReq, checkAccess, getAccountIdFromReq } from 'services/userService';
import { generateSingleRecurringMasterTask } from 'services/TaskService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { RepeatInterval, TaskRepeatFromWeekNum, TaskRepeatToWeekNum, ProductionId } = req.body;

    const email = await getEmailFromReq(req);
    const access = await checkAccess(email, { ProductionId });
    const AccountId = await getAccountIdFromReq(req);
    if (!access) return res.status(401).end();

    const recurringTask = await prisma.MasterTaskRepeat.create({
      data: {
        FromWeekNum: TaskRepeatFromWeekNum,
        ToWeekNum: TaskRepeatToWeekNum,
        Interval: RepeatInterval,
        FromWeekNumIsPostProduction: TaskRepeatFromWeekNum < 0,
        ToWeekNumIsPostProduction: TaskRepeatToWeekNum < 0,
      },
    });

    const task = await generateSingleRecurringMasterTask(req.body, recurringTask.Id);
    const createdTask = await prisma.MasterTask.create({
      data: {
        ...task
      },
    });

    res.status(200).json(createdTask);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error creating Recurring ProductionTask' });
  }
}
