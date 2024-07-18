import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getEmailFromReq, checkAccess } from 'services/userService';

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
    console.log('The req.body', req.body);
    const {
      Name,
      StartByWeekNum,
      CompleteByWeekNum,
      Priority,
      Progress,
      RepeatInterval,
      TaskRepeatFromWeekNum,
      TaskRepeatToWeekNum,
      AssignedToUserId,
      taskTitle,
      productionId,
      dueDate,
      interval,
      progress,
      assignee,
      assignedBy,
      // status,
      priority,
      // followUp,
      ProductionId,
      notes,
      intervalWeekDay,
      intervalMonthDate,
    } = req.body;

    console.log(Name);
    console.log(CompleteByWeekNum);
    console.log(StartByWeekNum);
    console.log(Priority);
    console.log(Progress);
    console.log(RepeatInterval);
    console.log(TaskRepeatFromWeekNum);
    console.log(TaskRepeatToWeekNum);
    console.log(AssignedToUserId);
    console.log(ProductionId);

    const email = await getEmailFromReq(req);
    const access = await checkAccess(email, { ProductionId: productionId });
    if (!access) return res.status(401).end();

    console.log('The req.body', req.body);
    // Fetch production weeks
    const productionWeeks = await prisma.productionWeek.findMany({
      where: {
        ProductionId: parseInt(productionId),
      },
    });

    // add days to a date
    const addDays = (date, days) => {
      const newDate = new Date(date);
      newDate.setDate(newDate.getDate() + days);
      return newDate;
    };

    const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const tasksToCreate = [];

    if (interval === 'once') {
      const dueDateObj = dueDate ? new Date(dueDate) : undefined;

      if (dueDateObj) {
        const matchedProductionWeek = productionWeeks.find((productionWeek) => {
          const mondayDate = new Date(productionWeek.MondayDate);
          const sundayDate = new Date(productionWeek.SundayDate);

          return dueDateObj >= mondayDate && dueDateObj <= sundayDate;
        });

        if (matchedProductionWeek) {
          tasksToCreate.push({
            dueDate: dueDateObj,
            startByWeekCode: matchedProductionWeek.WeekCode,
            completeByWeekCode: matchedProductionWeek.WeekCode,
          });
        } else {
          console.error('No due date found');
          tasksToCreate.push({
            dueDate: dueDateObj,
            startByWeekCode: '-',
            completeByWeekCode: '-',
          });
        }
      }
    } else if (interval === 'month') {
      const months = {};
      // sort the weeks into
      productionWeeks.forEach((productionWeek, index) => {
        const date = new Date(productionWeek.MondayDate);
        const monthKey = `${date.getFullYear()}-${date.getMonth()}`;

        if (!months[monthKey]) {
          months[monthKey] = {
            date,
            startByWeekCode: productionWeek.WeekCode,
            completeByWeekCode: productionWeeks[index + 1]?.WeekCode || '',
          };
        }
      });

      Object.values(months).forEach((monthObj: any) => {
        const date = new Date(monthObj.date);
        date.setDate(Math.min(intervalMonthDate, new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()));
        tasksToCreate.push({
          dueDate: date,
          startByWeekCode: monthObj.startByWeekCode,
          completeByWeekCode: monthObj.completeByWeekCode,
        });
      });
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
              Code: parseInt('0'),
              Name: taskTitle,
              StartByWeekNum: task.startByWeekCode,
              CompleteByWeekNum: task.completeByWeekCode,
              Priority: parseInt(priority),
              Notes: notes,
              Progress: parseInt(progress),
              Assignee: assignee ? parseInt(req.body.assignee) : undefined,
              AssignedBy: assignedBy ? parseInt(assignedBy) : undefined,
              Production: {
                connect: {
                  Id: parseInt(productionId),
                },
              },
              User: {
                connect: {
                  id: parseInt(assignedBy),
                },
              },
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
