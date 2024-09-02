import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getEmailFromReq, checkAccess } from 'services/userService';
import { generateRecurringProductionTasks, getMaxProductionTaskCode } from 'services/TaskService';
import { isNullOrEmpty } from 'utils';
import { calculateWeekNumber } from 'services/dateService';
import { omit } from 'radash';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { selectedTaskList, ProductionId } = req.body;

    const email = await getEmailFromReq(req);
    const access = await checkAccess(email, { ProductionId });
    if (!access) return res.status(401).end();
    const productionWeeks = await prisma.DateBlock.findFirst({
      where: {
        ProductionId: parseInt(ProductionId),
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
        const newRepeatingTask = await prisma.ProductionTaskRepeat.create({ data: { ...recurringTaskRecord } });

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
        );
        return await Promise.all(
          newProdTasks.map(async (newTask) => {
            await prisma.ProductionTask.create({
              data: {
                ...newTask,
                CopiedFrom: 'D',
                CopiedId: task.MTRId,
              },
            });
          }),
        );
      } else {
        const Code = (await getMaxProductionTaskCode(ProductionId)) + index + 1;
        const taskCompleteBys = {
          StartByIsPostProduction:
            task.StartByWeekNum < 0 ? false : task.StartByWeekNum > calculateWeekNumber(prodStartDate, prodEndDate),
          CompleteByIsPostProduction:
            task.CompleteByWeekNum < 0
              ? false
              : task.CompleteByWeekNum > calculateWeekNumber(prodStartDate, prodEndDate),
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
          ProductionId,
          CopiedFrom: 'M',
          CopiedId: task.Id,
          Progress: 0,
          TaskCompletedDate: null,
        };
        return await prisma.ProductionTask.create({ data: { ...newTaskRecord } });
      }
    });

    return res.status(200).json(taskList);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error creating adding from Master Task' });
  }
}
