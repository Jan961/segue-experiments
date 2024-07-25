import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getEmailFromReq, checkAccess } from 'services/userService';
import { generateRecurringProductionTasks } from 'services/TaskService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { RepeatInterval, TaskRepeatFromWeekNum, TaskRepeatToWeekNum, ProductionId } = req.body;

    const email = await getEmailFromReq(req);
    const access = await checkAccess(email, { ProductionId });
    if (!access) return res.status(401).end();

    const productionWeeks = await prisma.DateBlock.findMany({
      where: {
        ProductionId: parseInt(ProductionId),
      },
    });

    const recurringTask = await prisma.ProductionTaskRepeat.create({
      data: {
        FromWeekNum: TaskRepeatFromWeekNum,
        ToWeekNum: TaskRepeatToWeekNum,
        Interval: RepeatInterval,
        FromWeekNumIsPostProduction: TaskRepeatFromWeekNum < 0,
        ToWeekNumIsPostProduction: TaskRepeatToWeekNum < 0,
      },
    });

    const prodBlock = productionWeeks.find((dateBlock) => {
      return dateBlock.Name === 'Production';
    });
    console.log(
      'NEW TASK LIST -------------------------------------------------------------------------------------------------------------',
    );
    const taskList: any[] = await generateRecurringProductionTasks(
      req.body,
      prodBlock,
      prodBlock?.StartDate,
      recurringTask.Id,
    );

    const createdTasks = await Promise.all(
      taskList.map(
        async (task) =>
          await prisma.productionTask.create({
            data: {
              ...task,
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
