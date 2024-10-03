import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { generateRecurringProductionTasks, getMaxProductionTaskCode } from 'services/TaskService';
import { isNullOrEmpty } from 'utils';
import { calculateWeekNumber } from 'services/dateService';
import { omit } from 'radash';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { selectedTaskList, ProductionId } = req.body;
    const prisma = await getPrismaClient(req);
    const productionWeeks = await prisma.dateBlock.findFirst({
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
      if (!isNullOrEmpty(task.PRTId)) {
        const { Interval, FromWeekNum, ToWeekNum } = task;
        const recurringTaskRecord = {
          FromWeekNum,
          ToWeekNum,
          Interval,
          FromWeekNumIsPostProduction:
            FromWeekNum < 0 ? false : FromWeekNum > calculateWeekNumber(prodStartDate, prodEndDate),
          ToWeekNumIsPostProduction:
            ToWeekNum < 0 ? false : ToWeekNum > calculateWeekNumber(prodStartDate, prodEndDate),
        };
        const newRepeatingTask = await prisma.productionTaskRepeat.create({ data: { ...recurringTaskRecord } });
        const recurringTaskInfo = {
          Name: task.Name,
          StartByWeekNum: task.StartByWeekNum,
          CompleteByWeekNum: task.CompleteByWeekNum,
          Priority: task.Priority,
          Progress: 0,
          RepeatInterval: Interval,
          TaskRepeatFromWeekNum: FromWeekNum,
          TaskRepeatToWeekNum: ToWeekNum,
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
                CopiedFrom: 'R',
                CopiedId: task.PRTId,
              },
            });
          }),
        );
      } else {
        const Code = (await getMaxProductionTaskCode(ProductionId, req)) + index + 1;
        const taskCompleteBys = {
          StartByIsPostProduction:
            task.StartByWeekNum < 0 ? false : task.StartByWeekNum > calculateWeekNumber(prodStartDate, prodEndDate),
          CompleteByIsPostProduction:
            task.CompleteByWeekNum < 0
              ? false
              : task.CompleteByWeekNum > calculateWeekNumber(prodStartDate, prodEndDate),
        };
        const filteredTask = omit(task, ['Id', 'FromWeekNum', 'ToWeekNum', 'Interval']);
        const newTaskRecord = {
          ...filteredTask,
          ...taskCompleteBys,
          Code,
          Production: { connect: { Id: ProductionId } },
          CopiedFrom: 'P',
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
