import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { generateRecurringProductionTasks, getMaxProductionTaskCode } from 'services/TaskService';
import { isNullOrEmpty } from 'utils';
import { calculateWeekNumber } from 'services/dateService';
import { omit } from 'radash';
import { PrismaClient } from 'prisma/generated/prisma-client';

export const createRecurringTask = async (
  prisma: PrismaClient,
  task,
  ProductionId: number,
  prodStartDate: Date,
  prodEndDate: Date,
  counter: number,
  req: NextApiRequest,
  productionWeeks,
) => {
  const { Interval, FromWeekNum, ToWeekNum } = task;

  const recurringTaskRecord = {
    FromWeekNum,
    ToWeekNum,
    Interval,
    FromWeekNumIsPostProduction:
      FromWeekNum < 0 ? false : FromWeekNum > calculateWeekNumber(prodStartDate.getTime(), prodEndDate.getTime()),
    ToWeekNumIsPostProduction:
      ToWeekNum < 0 ? false : ToWeekNum > calculateWeekNumber(prodStartDate.getTime(), prodEndDate.getTime()),
  };

  const newRepeatingTask = await prisma.productionTaskRepeat.create({
    data: recurringTaskRecord,
  });

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

  const createdTasks = await Promise.all(
    newProdTasks.map((newTask) =>
      prisma.productionTask.create({
        data: {
          ...newTask,
          CopiedFrom: 'R',
          CopiedId: task.PRTId,
        },
      }),
    ),
  );

  return createdTasks;
};

const createSingleTask = async (
  prisma: PrismaClient,
  task,
  ProductionId: number,
  prodStartDate: Date,
  prodEndDate: Date,
  baseCode: number,
  index: number,
) => {
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

  const filteredTask = omit(task, ['Id', 'FromWeekNum', 'ToWeekNum', 'Interval']);

  return prisma.productionTask.create({
    data: {
      ...filteredTask,
      ...taskCompleteBys,
      Code: baseCode + index + 1,
      Production: { connect: { Id: ProductionId } },
      CopiedFrom: 'P',
      CopiedId: task.Id,
      Progress: 0,
      TaskCompletedDate: null,
      Name: task.Name,
    },
  });
};

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { selectedTaskList, ProductionId } = req.body;
    const prisma = await getPrismaClient(req);

    // Get production weeks
    const productionWeeks = await prisma.dateBlock.findFirst({
      where: {
        ProductionId: parseInt(ProductionId),
        Name: 'Production',
      },
      select: { StartDate: true, EndDate: true },
    });

    if (!productionWeeks) {
      return res.status(404).json({ error: 'Production weeks not found' });
    }

    const prodStartDate = productionWeeks.StartDate;
    const prodEndDate = productionWeeks.EndDate;

    // Get base code once for all non-recurring tasks
    const baseCode = await getMaxProductionTaskCode(ProductionId, req);

    // Run all operations in a transaction
    const result = await prisma.$transaction(async (tx: PrismaClient) => {
      const taskPromises = selectedTaskList.map((task, index) =>
        !isNullOrEmpty(task.PRTId)
          ? createRecurringTask(tx, task, ProductionId, prodStartDate, prodEndDate, 1, req, productionWeeks)
          : createSingleTask(tx, task, ProductionId, prodStartDate, prodEndDate, baseCode, index),
      );

      return Promise.all(taskPromises);
    });

    return res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error creating production tasks' });
  }
};

export default handle;
