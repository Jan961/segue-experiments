import { ProductionTaskDTO } from 'interfaces';
import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getEmailFromReq, checkAccess } from 'services/userService';
import { generateRecurringTasks, getNewTasksNum } from 'services/TaskService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const task = req.body as ProductionTaskDTO;
      const { Id } = task;
      const email = await getEmailFromReq(req);
      const access = await checkAccess(email, { TaskId: Id });
      if (!access) return res.status(401).end();

      const taskObj = await prisma.ProductionTask.findFirst({
        where: { Id },
        include: { Production: { include: { DateBlock: true } } },
      });
      const { TaskRepeatFromWeekNum, TaskRepeatToWeekNum, RepeatInterval, PRTId } = req.body;

      const fieldList = ['TaskRepeatFromWeekNum', 'TaskRepeatToWeekNum', 'RepeatInterval', 'PRTId'];

      let fieldDifference = false;
      fieldList.forEach((field) => {
        if (taskObj.field !== req.body[field]) {
          fieldDifference = true;
        }
      });

      if (fieldDifference) {
        console.log(taskObj);

        const productionDateBlock = taskObj.Production.DateBlock;

        const prodStartDate = new Date(
          productionDateBlock.find((dateBlock) => dateBlock.Name === 'Production')?.StartDate,
        );

        const numTasksByCalc = getNewTasksNum(
          prodStartDate,
          TaskRepeatFromWeekNum,
          TaskRepeatToWeekNum,
          RepeatInterval,
        );
        const numTasksExist =
          (
            await prisma.ProductionTaskRepeat.findFirst({
              where: { Id: PRTId },
              include: { ProductionTask: true },
            })
          )?.ProductionTask || [];
        console.log(numTasksExist);
        console.log(numTasksByCalc);

        if (numTasksExist !== numTasksByCalc) {
          const newTasks = await generateRecurringTasks(req.body, productionDateBlock, prodStartDate, PRTId);
          console.log(newTasks);
          const tasksToKeep = [];
          const tasksToDelete = [];
          const fieldList = [
            'Name',
            'Priority',
            'Notes',
            'AssignedToUserId',
            'StartByWeekNum',
            'CompleteByWeekNum',
            'TaskCompletedDate',
          ];
          // this is to find tasks that already exist and match the newly generated tasks so they wont be deleted
          numTasksExist.forEach((task) => {
            console.log(task);
            let taskFound = false;
            newTasks.forEach((newTask) => {
              let fieldMisMatch = false;
              fieldList.forEach((field) => {
                if (newTask[field] !== task[field]) {
                  fieldMisMatch = true;
                }
              });
              taskFound = !fieldMisMatch;
            });
            if (taskFound) {
              tasksToKeep.push(task);
            } else {
              tasksToDelete.push(task);
            }
          });
          console.log('DELETING');
          tasksToDelete.forEach((task) => {
            console.log(task);
          });
          console.log(tasksToDelete.map((task) => task.Id));
          console.log('RAHHHHhhh');
          await prisma.ProductionTask.deleteMany({ where: { Id: { in: tasksToDelete.map((task) => task.Id) } } });

          const createdTasks = await Promise.all(
            newTasks.map(async (task) => {
              let taskFound = false;
              tasksToKeep.forEach((keepTask) => {
                let fieldMisMatch = false;
                fieldList.forEach((field) => {
                  if (task[field] !== keepTask[field]) {
                    fieldMisMatch = true;
                  }
                });
                taskFound = !fieldMisMatch;
              });
              if (!taskFound) {
                await prisma.productionTask.create({
                  data: {
                    ...task,
                  },
                });
              }
            }),
          );

          return res.status(201).json(createdTasks);
        }
        return res.status(201).json({});
      } else {
        const updatedTask = await prisma.ProductionTask.update({
          where: { Id: task.Id },
          data: {
            Name: task.Name,
            Code: task.Code,
            Priority: task.Priority,
            Notes: task.Notes,
            Progress: task.Progress,
            StartByWeekNum: task.StartByWeekNum,
            CompleteByWeekNum: task.CompleteByWeekNum,
            StartByIsPostProduction: task.StartByIsPostProduction,
            CompleteByIsPostProduction: task.CompleteByIsPostProduction,
            TaskCompletedDate: new Date(task?.TaskCompletedDate) || null,
            ...(task.ProductionId && {
              Production: {
                connect: {
                  Id: task.ProductionId,
                },
              },
            }),
            ...(task.AssignedToUserId && {
              User: {
                connect: {
                  Id: task.AssignedToUserId,
                },
              },
            }),
          },
        });
        return res.status(200).json(updatedTask);
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'Error updating ProductionTask' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
