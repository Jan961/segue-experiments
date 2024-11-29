import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

import { generateRecurringProductionTasks, getMaxProductionTaskCode } from 'services/TaskService';
import { isNullOrEmpty } from 'utils';
import { calculateWeekNumber } from 'services/dateService';
import { omit } from 'radash';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { selectedTaskList, ProductionId }: { selectedTaskList: any; ProductionId: number } = req.body;
    const prisma = await getPrismaClient(req);
    const productionWeeks = await prisma.dateBlock.findFirst({
      where: {
        ProductionId,
        Name: 'Production',
      },
      select: { StartDate: true, EndDate: true },
    });

    const prodStartDate = productionWeeks.StartDate;
    const prodEndDate = productionWeeks.EndDate;
    const counter = 1;

    const taskList = selectedTaskList.map(async (task, index) => {
      if (!isNullOrEmpty(task?.MTRId)) {
        const { RepeatInterval, TaskRepeatFromWeekNum, TaskRepeatToWeekNum } = task;
        const recurringTaskRecord = {
          FromWeekNum: TaskRepeatFromWeekNum,
          ToWeekNum: TaskRepeatToWeekNum,
          Interval: RepeatInterval,
          FromWeekNumIsPostProduction: false,
          ToWeekNumIsPostProduction: false,
        };
        const newRepeatingTask = await prisma.productionTaskRepeat.create({ data: { ...recurringTaskRecord } });

        const recurringTaskInfo = {
          Name: task.Name,
          StartByWeekNum: task.StartByWeekNum,
          CompleteByWeekNum: task.CompleteByWeekNum,
          Priority: task.Priority,
          Progress: 0,
          RepeatInterval,
          TaskRepeatFromWeekNum,
          TaskRepeatToWeekNum,
          TaskCompletedDate: null,
          TaskAssignedToAccUserId: task.TaskAssignedToAccUserId,
          ProductionId,
          Notes: task.Notes,
        };

        const newProdTasks = await generateRecurringProductionTasks(
          recurringTaskInfo,
          productionWeeks,
          prodStartDate,
          newRepeatingTask.Id,
          counter,
          req,
        );
        return await Promise.all(
          newProdTasks.map(async (newTask) => {
            await prisma.productionTask.create({
              data: {
                ...newTask,
                CopiedFrom: 'D',
                CopiedId: task.MTRId,
              },
            });
          }),
        );
      } else {
        const Code = (await getMaxProductionTaskCode(ProductionId, req)) + index + 1;
        const taskCompleteBys = {
          StartByIsPostProduction:
            task.StartByWeekNum < 0
              ? false
              : task.StartByWeekNum > calculateWeekNumber(prodStartDate.getTime(), prodEndDate.getTime()),
          CompleteByIsPostProduction:
            task.CompleteByWeekNum < 0
              ? false
              : task.CompleteByWeekNum > calculateWeekNumber(prodStartDate.getTime(), prodEndDate.getTime()),
        };
        const filteredTask = omit(task, [
          'Id',
          'FromWeekNum',
          'ToWeekNum',
          'Interval',
          'AccountId',
          'MTRId',
          'MasterTaskRepeat',
          'RepeatInterval',
          'TaskRepeatFromWeekNum',
          'TaskRepeatToWeekNum',
          'TaskStartByIsPostProduction',
          'TaskCompleteByIsPostProduction',
        ]);
        const newTaskRecord = {
          ...filteredTask,
          ...taskCompleteBys,
          Code,
          Production: { connect: { Id: ProductionId } },
          CopiedFrom: 'M',
          CopiedId: task.Id,
          Progress: 0,
          TaskCompletedDate: null,
          Name: task.Name,
        };
        return await prisma.productionTask.create({ data: newTaskRecord });
      }
    });

    return res.status(200).json(taskList);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error creating adding from Master Task' });
  }
}
