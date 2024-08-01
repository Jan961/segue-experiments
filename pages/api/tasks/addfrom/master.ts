import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getEmailFromReq, checkAccess } from 'services/userService';
import { generateRecurringProductionTasks, getMaxProductionTaskCode } from 'services/TaskService';
import { isNullOrEmpty } from 'utils';
import { calculateWeekNumber } from 'services/dateService';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { selectedTaskList, ProductionId } = req.body;

    const email = await getEmailFromReq(req);
    const access = await checkAccess(email, { ProductionId });
    if (!access) return res.status(401).end();

    const productionWeeks = await prisma.DateBlock.findMany({
      where: {
        ProductionId: parseInt(ProductionId),
      },
    });
    const prodBlock = productionWeeks.find((dateBlock) => {
      return dateBlock.Name === 'Production';
    });
    let counter = 0;
    const createdTasks = await Promise.all(
      selectedTaskList.map(async (task) => {
        if (!isNullOrEmpty(task?.RepeatInterval)) {
          const recurringTask = await prisma.ProductionTaskRepeat.create({
            data: {
              FromWeekNum: task.TaskRepeatFromWeekNum,
              ToWeekNum: task.TaskRepeatToWeekNum,
              Interval: task.RepeatInterval,
              FromWeekNumIsPostProduction: task.TaskRepeatFromWeekNum < 0,
              ToWeekNumIsPostProduction: task.TaskRepeatToWeekNum < 0,
            },
          });
          counter++;

          return await generateRecurringProductionTasks(
            { ...task, ProductionId },
            prodBlock,
            prodBlock?.StartDate,
            recurringTask.Id,
            counter,
          );
        } else {
          return [
            {
              ProductionId,
              Code: (await getMaxProductionTaskCode(ProductionId)) + 1,
              Name: task.Name,
              CopiedFrom: 'M',
              CopiedId: task.Id,
              Priority: task.Priority,
              Notes: task.Notes,
              Progress: 0,
              AssignedToUserId: task.AssignedToUserId,
              CompleteByIsPostProduction:
                task.CompleteByWeekNum > calculateWeekNumber(prodBlock?.StartDate, prodBlock?.EndDate),
              StartByWeekNum: task.StartByWeekNum,
              StartByIsPostProduction:
                task.StartByWeekNum > calculateWeekNumber(prodBlock?.StartDate, prodBlock?.EndDate),
              CompleteByWeekNum: task.CompleteByWeekNum,
            },
          ];
        }
      }),
    );
    const taskObjects = await Promise.all(
      createdTasks.map(async (task) => {
        return await Promise.all(
          task.map(async (created) => {
            return await prisma.ProductionTask.create({
              data: {
                ...created,
                Progress: 0,
                TaskCompletedDate: null,
              },
            });
          }),
        );
      }),
    );

    return res.status(200).json(taskObjects);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error creating adding from Master Task' });
  }
}
