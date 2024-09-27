import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getEmailFromReq, checkAccess } from 'services/userService';
import { generateRecurringProductionTasks } from 'services/TaskService';
import { productionTaskSchema, recurringProductionTaskSchema } from 'validators/tasks';

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
    const recurringTaskRecord = {
      FromWeekNum: TaskRepeatFromWeekNum,
      ToWeekNum: TaskRepeatToWeekNum,
      Interval: RepeatInterval,
      FromWeekNumIsPostProduction: TaskRepeatFromWeekNum < 0,
      ToWeekNumIsPostProduction: TaskRepeatToWeekNum < 0,
    };
    await recurringProductionTaskSchema.validate(recurringTaskRecord);
    const recurringTask = await prisma.ProductionTaskRepeat.create({
      data: {
        ...recurringTaskRecord,
      },
    });

    const prodBlock = productionWeeks.find((dateBlock) => {
      return dateBlock.Name === 'Production';
    });
    const taskList: any[] = await generateRecurringProductionTasks(
      req.body,
      prodBlock,
      prodBlock?.StartDate,
      recurringTask.Id,
    );

    const createdTasks = await Promise.all(
      taskList.map(async (task) => {
        await productionTaskSchema.validate(task);
        await prisma.productionTask.create({
          data: {
            ...task,
          },
        });
      }),
    );
    res.status(200).json(createdTasks);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error creating Recurring ProductionTask' });
  }
}
