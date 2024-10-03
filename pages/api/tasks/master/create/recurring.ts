import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { generateSingleRecurringMasterTask } from 'services/TaskService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { RepeatInterval, TaskRepeatFromWeekNum, TaskRepeatToWeekNum } = req.body;
    const prisma = await getPrismaClient(req);
    const recurringTask = await prisma.masterTaskRepeat.create({
      data: {
        FromWeekNum: TaskRepeatFromWeekNum,
        ToWeekNum: TaskRepeatToWeekNum,
        Interval: RepeatInterval,
        FromWeekNumIsPostProduction: TaskRepeatFromWeekNum < 0,
        ToWeekNumIsPostProduction: TaskRepeatToWeekNum < 0,
      },
    });

    const task = await generateSingleRecurringMasterTask(req.body, recurringTask.Id, req);
    const createdTask = await prisma.masterTask.create({
      data: {
        ...task,
      },
    });

    res.status(200).json(createdTask);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error creating Recurring ProductionTask' });
  }
}
