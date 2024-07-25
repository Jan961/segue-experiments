import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getEmailFromReq, checkAccess, getAccountIdFromReq } from 'services/userService';
import { generateRecurringMasterTasks } from 'services/TaskService';

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

    console.log(
      'NEW TASK LIST -------------------------------------------------------------------------------------------------------------',
    );
    console.log(req.body);
    const taskList: any[] = await generateRecurringMasterTasks(req.body, recurringTask.Id);

    const createdTasks = await Promise.all(
      taskList.map(
        async (task) =>
          await prisma.MasterTask.create({
            data: {
              ...task,
              AccountId,
            },
          }),
      ),
    );
    res.json(createdTasks);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error creating Recurring ProductionTask' });
  }
}
