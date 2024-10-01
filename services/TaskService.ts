import getPrismaClient from 'lib/prisma';
import { addDurationToDate, addOneMonth, calculateWeekNumber } from './dateService';
import { sortTasksByDueAndAlpha } from 'utils/tasks';
import { NextApiRequest } from 'next';

export const getMasterTasksList = async (req: NextApiRequest) => {
  const prisma = await getPrismaClient(req);
  const masterTaskList = await prisma.masterTask.findMany({
    orderBy: {
      StartByWeekNum: 'asc',
    },
    include: {
      MasterTaskRepeat: {
        select: {
          Interval: true,
          FromWeekNum: true,
          ToWeekNum: true,
          Id: true,
        },
      },
    },
  });

  return sortTasksByDueAndAlpha(
    masterTaskList.map((task) => {
      return {
        ...task,
        RepeatInterval: task?.MasterTaskRepeat?.Interval || null,
        TaskRepeatFromWeekNum: task?.MasterTaskRepeat?.FromWeekNum || null,
        TaskRepeatToWeekNum: task?.MasterTaskRepeat?.ToWeekNum || null,
      };
    }),
  );
};

export const getMaxTaskCode = async (req: NextApiRequest) => {
  const prisma = await getPrismaClient(req);
  return await prisma.masterTask.findFirst({
    orderBy: {
      Code: 'desc',
    },
    select: {
      Code: true,
    },
  });
};

export const getMaxProductionTaskCode = async (prodId: number, req: NextApiRequest) => {
  const prisma = await getPrismaClient(req);
  const output = await prisma.productionTask.findFirst({
    where: { ProductionId: prodId },
    orderBy: {
      Code: 'desc',
    },
    select: {
      Code: true,
    },
  });
  return output?.Code || 0;
};

export const getMaxMasterTaskCode = async (req: NextApiRequest) => {
  const prisma = await getPrismaClient(req);
  return await prisma.masterTask.findFirst({
    orderBy: {
      Code: 'desc',
    },
    select: {
      Code: true,
    },
  });
};

export const generateRecurringMasterTasks = async (requestBody, MTRId: number, req: NextApiRequest) => {
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
    TaskAssignedToAccUserId,
    Notes,
  } = requestBody;

  const prisma = await getPrismaClient(req);
  let maxTaskCode =
    (
      await prisma.masterTask.findFirst({
        select: {
          Code: true,
        },
        orderBy: {
          Code: 'desc',
        },
      })
    )?.Code + 1 || 1;

  const tasksToCreate = [];

  const taskAllowance = CompleteByWeekNum - StartByWeekNum;
  let taskStartDate = TaskRepeatFromWeekNum;

  const multiplier = RepeatInterval === 'biWeekly' ? 2 : 1;
  while (taskStartDate <= TaskRepeatToWeekNum) {
    const completeBy = taskStartDate + taskAllowance;
    tasksToCreate.push({
      Code: maxTaskCode,
      Name,
      Priority,
      Notes,
      Progress,
      TaskAssignedToAccUserId,
      TaskStartByIsPostProduction: false,
      StartByWeekNum: taskStartDate,
      TaskCompleteByIsPostProduction: false,
      CompleteByWeekNum: completeBy,
      TaskCompletedDate,
      MTRId,
    });
    maxTaskCode++;
    taskStartDate += RepeatInterval === 'monthly' ? 4 : multiplier;
  }
  return tasksToCreate;
};

export const generateSingleRecurringMasterTask = async (requestBody, MTRId: number, req: NextApiRequest) => {
  const { Name, StartByWeekNum, CompleteByWeekNum, Priority, TaskRepeatFromWeekNum, TaskAssignedToAccUserId, Notes } =
    requestBody;
  const prisma = await getPrismaClient(req);
  const maxTaskCode =
    (
      await prisma.masterTask.findFirst({
        select: {
          Code: true,
        },
        orderBy: {
          Code: 'desc',
        },
      })
    )?.Code + 1 || 0;

  const taskAllowance = CompleteByWeekNum - StartByWeekNum;
  const taskStartDate = TaskRepeatFromWeekNum;

  const completeBy = taskStartDate + taskAllowance;
  return {
    Code: maxTaskCode,
    Name,
    Priority,
    Notes,
    TaskAssignedToAccUserId,
    TaskStartByIsPostProduction: false,
    StartByWeekNum: taskStartDate,
    TaskCompleteByIsPostProduction: false,
    CompleteByWeekNum: completeBy,
    MTRId,
  };
};

export const generateRecurringProductionTasks = async (
  requestBody,
  prodBlock,
  prodStartDate,
  PRTId,
  counter = 1,
  req: NextApiRequest,
) => {
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
    TaskAssignedToAccUserId,
    ProductionId,
    Notes,
  } = requestBody;
  const prisma = await getPrismaClient(req);
  let maxTaskCode =
    (
      await prisma.productionTask.findFirst({
        select: {
          Code: true,
        },
        where: { ProductionId: { equals: ProductionId } },
        orderBy: {
          Code: 'desc',
        },
      })
    )?.Code + counter || counter;

  const tasksToCreate = [];

  const taskAllowance = CompleteByWeekNum - StartByWeekNum;
  let taskStartDate = addDurationToDate(prodStartDate, TaskRepeatFromWeekNum * 7, true);
  const taskEndDate = addDurationToDate(prodStartDate, TaskRepeatToWeekNum * 7, true);

  const multiplier = RepeatInterval === 'biWeekly' ? 2 : 1;
  while (taskStartDate <= taskEndDate) {
    tasksToCreate.push({
      ProductionId: parseInt(ProductionId),
      Code: maxTaskCode + counter,
      Name,
      Priority,
      Notes,
      Progress: parseInt(Progress) || 0,
      TaskAssignedToAccUserId,
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
