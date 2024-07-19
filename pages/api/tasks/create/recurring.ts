import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getEmailFromReq, checkAccess } from 'services/userService';
import { addDurationToDate, calculateWeekNumber } from 'services/dateService';

// The req.body {
//   ProductionId: 29,
//   Name: 'mmmana',
//   StartByWeekNum: -260,
//   CompleteByWeekNum: -259,
//   Priority: 1,
//   Progress: 100,
//   TaskCompletedDate: '2024-07-18T00:00:00.000Z',
//   RepeatInterval: 'weekly',
//   TaskRepeatFromWeekNum: -52,
//   TaskRepeatToWeekNum: -51,
//   AssignedToUserId: 1,
//   Notes: 'sdasd'
// }

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
      interval,
      intervalWeekDay,
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

    // add days to a date
    const addDays = (date, days) => {
      const newDate = new Date(date);
      newDate.setDate(newDate.getDate() + days);
      return newDate;
    };

    const prodBlock = productionWeeks.find((dateBlock) => {
      return dateBlock.Name === 'Production';
    });

    const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

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

    if (RepeatInterval === 'monthly') {
      const prodStartDate = new Date(prodBlock?.StartDate);
      const taskAllowance = CompleteByWeekNum - StartByWeekNum;
      let taskStartDate = addDurationToDate(prodStartDate, TaskRepeatFromWeekNum * 7, true);
      const taskEndDate = addDurationToDate(prodStartDate, TaskRepeatToWeekNum * 7, true);
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
        taskStartDate = addDurationToDate(taskStartDate, 7, true);
      }
    } else if (interval === 'week' || interval === 'biweek') {
      const dayOffset = weekDays.indexOf(intervalWeekDay);
      const weekOffset = interval === 'biWeek' ? 2 : 1;

      for (let i = 0; i < productionWeeks.length; i += weekOffset) {
        const productionWeek = productionWeeks[i];
        const date = addDays(productionWeek.MondayDate, dayOffset);
        tasksToCreate.push({
          dueDate: date,
          startByWeekCode: productionWeek.WeekCode,
          completeByWeekCode: productionWeeks[i + 1]?.WeekCode || '',
        });
      }
    }

    //  await console.log("tasks to create", tasksToCreate)
    //  await console.log("the interval", interval)

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
