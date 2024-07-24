import prisma from 'lib/prisma';
import { addDurationToDate, addOneMonth, calculateWeekNumber } from './dateService';

export const getMasterTasksList = async (AccountId: number) => {
  return await prisma.masterTask.findMany({
    where: {
      AccountId,
    },
    orderBy: {
      StartByWeekNum: 'asc',
    },
  });
};

export const getMaxTaskCode = async () => {
  return await prisma.masterTask.findFirst({
    orderBy: {
      Code: 'desc',
    },
    select: {
      Code: true,
    },
  });
};

export const getMaxProductionTaskCode = async (prodId: number) => {
  return await prisma.ProductionTask.findFirst({
    where: { ProductionId: prodId },
    orderBy: {
      Code: 'desc',
    },
    select: {
      Code: true,
    },
  });
};

export const getMaxMasterTaskCode = async () => {
  return await prisma.MasterTask.findFirst({
    orderBy: {
      Code: 'desc',
    },
    select: {
      Code: true,
    },
  });
};

export const generateRecurringTasks = async (requestBody, prodBlock, prodStartDate, PRTId) => {
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
  } = requestBody;

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
      PRTId,
    });
    maxTaskCode++;
    taskStartDate =
      RepeatInterval === 'monthly'
        ? addOneMonth(taskStartDate)
        : addDurationToDate(taskStartDate, 7 * multiplier, true);
  }
  return tasksToCreate;
};

export const getNewTasksNum = (
  prodStartDate: Date,
  taskRepeatFromWeekNum,
  taskRepeatToWeekNum,
  repeatInterval,
): number => {
  console.log(repeatInterval);
  let taskStartDate = addDurationToDate(prodStartDate, taskRepeatFromWeekNum * 7, true);
  const taskEndDate = addDurationToDate(prodStartDate, taskRepeatToWeekNum * 7, true);

  const multiplier = repeatInterval === 'biweekly' ? 2 : 1;
  let counter = 0;
  while (taskStartDate <= taskEndDate) {
    counter++;
    taskStartDate =
      repeatInterval === 'monthly'
        ? addOneMonth(taskStartDate)
        : addDurationToDate(taskStartDate, 7 * multiplier, true);
  }

  return counter;
};
