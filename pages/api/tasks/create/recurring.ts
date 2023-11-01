import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getEmailFromReq, checkAccess } from 'services/userService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const {
      taskTitle,
      dueDate,
      interval,
      progress,
      assignee,
      assignedBy,
      status,
      priority,
      followUp,
      tourId,
      notes,
      intervalWeekDay,
      intervalMonthDate,
    } = req.body;

    const email = await getEmailFromReq(req);
    const access = await checkAccess(email, { TourId: tourId });
    if (!access) return res.status(401).end();

    console.log('The req.body', req.body);
    // Fetch tour weeks
    const tourWeeks = await prisma.tourWeek.findMany({
      where: {
        TourId: parseInt(tourId),
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
        const matchedTourWeek = tourWeeks.find((tourWeek) => {
          const mondayDate = new Date(tourWeek.MondayDate);
          const sundayDate = new Date(tourWeek.SundayDate);

          return dueDateObj >= mondayDate && dueDateObj <= sundayDate;
        });

        if (matchedTourWeek) {
          tasksToCreate.push({
            dueDate: dueDateObj,
            startByWeekCode: matchedTourWeek.WeekCode,
            completeByWeekCode: matchedTourWeek.WeekCode,
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
      tourWeeks.forEach((tourWeek, index) => {
        const date = new Date(tourWeek.MondayDate);
        const monthKey = `${date.getFullYear()}-${date.getMonth()}`;

        if (!months[monthKey]) {
          months[monthKey] = {
            date,
            startByWeekCode: tourWeek.WeekCode,
            completeByWeekCode: tourWeeks[index + 1]?.WeekCode || '',
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

      for (let i = 0; i < tourWeeks.length; i += weekOffset) {
        const tourWeek = tourWeeks[i];
        const date = addDays(tourWeek.MondayDate, dayOffset);
        tasksToCreate.push({
          dueDate: date,
          startByWeekCode: tourWeek.WeekCode,
          completeByWeekCode: tourWeeks[i + 1]?.WeekCode || '',
        });
      }
    }

    //  await console.log("tasks to create", tasksToCreate)
    //  await console.log("the interval", interval)

    const createdTasks = await Promise.all(
      tasksToCreate.map(
        async (task) =>
          await prisma.tourTask.create({
            data: {
              TourId: parseInt(tourId),
              TaskCode: parseInt('0'),
              TaskName: taskTitle,
              StartByWeekCode: task.startByWeekCode,
              CompleteByWeekCode: task.completeByWeekCode,
              Priority: parseInt(priority),
              Notes: notes,
              DeptRCK: req.body.DeptRCK === 'true',
              DeptMarketing: req.body.DeptMarketing === 'true',
              DeptProduction: req.body.DeptProduction === 'true',
              DeptAccounts: req.body.DeptAccounts === 'true',
              Progress: parseInt(progress),
              DueDate: task.dueDate,
              FollowUp: followUp ? new Date(followUp) : undefined,
              Assignee: assignee ? parseInt(req.body.assignee) : undefined,
              AssignedBy: assignedBy ? parseInt(assignedBy) : undefined,
              CreatedDate: new Date(),
              Interval: interval,
              Status: status,
            },
          }),
      ),
    );

    res.json(createdTasks);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error creating Recurring TourTask' });
  }
}
