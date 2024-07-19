import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getEmailFromReq, checkAccess } from 'services/userService';
import { addDurationToDate, calculateWeekNumber } from 'services/dateService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const {
      Name,
      StartByWeekNum,
      CompleteByWeekNum,
      Priority,
      Progress,
      RepeatInterval,
      TaskRepeatFromWeekNum,
      TaskRepeatToWeekNum,
      TaskCompletedDate,
      AssignedToUserId,
      ProductionId,
      Notes,
    } = req.body;

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

    const addOneMonth = (date: Date) => {
      const newDate = new Date(date); // Create a new Date object to avoid mutating the original date
      newDate.setMonth(newDate.getMonth() + 1); // Add one month to the new date
      return newDate;
    };

    const prodBlock = productionWeeks.find((dateBlock) => {
      return dateBlock.Name === 'Production';
    });

    let maxTaskCode =
      (
        await prisma.ProductionTask.findFirst({
          select: {
            Code: true,
          },
          where: { ProductionId: { equals: ProductionId } },
          orderBy: {
            Code: 'desc',
          },
        })
      )?.Code + 1 || 0;

    const tasksToCreate = [];

    const prodStartDate = new Date(prodBlock?.StartDate);
    const taskAllowance = CompleteByWeekNum - StartByWeekNum;
    let taskStartDate = addDurationToDate(prodStartDate, TaskRepeatFromWeekNum * 7, true);
    const taskEndDate = addDurationToDate(prodStartDate, TaskRepeatToWeekNum * 7, true);

    const multiplier = RepeatInterval === 'biWeekly' ? 2 : 1;
    while (taskStartDate <= taskEndDate) {
      tasksToCreate.push({
        ProductionId: parseInt(ProductionId),
        Code: maxTaskCode,
        Name,
        Priority,
        Notes,
        Progress,
        AssignedToUserId,
        CompleteByIsPostProduction: CompleteByWeekNum > calculateWeekNumber(prodStartDate, prodBlock?.EndDate),
        StartByWeekNum: calculateWeekNumber(prodStartDate, taskStartDate),
        StartByIsPostProduction: StartByWeekNum > calculateWeekNumber(prodStartDate, prodBlock?.EndDate),
        CompleteByWeekNum: calculateWeekNumber(prodStartDate, taskStartDate) + taskAllowance,
        TaskCompletedDate,
        PRTId: recurringTask.Id,
      });
      maxTaskCode++;
      taskStartDate =
        RepeatInterval === 'monthly'
          ? addOneMonth(taskStartDate)
          : addDurationToDate(taskStartDate, 7 * multiplier, true);
    }

    const createdTasks = await Promise.all(
      tasksToCreate.map(
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
