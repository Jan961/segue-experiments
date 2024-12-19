import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getMaxMasterTaskCode } from 'services/TaskService';
import { isNullOrEmpty } from 'utils';
import { omit } from 'radash';
import { PrismaClient } from 'prisma/generated/prisma-client';

async function createRepeatingTask(prisma: PrismaClient, taskData) {
  const {
    Interval,
    FromWeekNum,
    ToWeekNum,
    Name,
    StartByWeekNum,
    CompleteByWeekNum,
    Priority,
    TaskAssignedToAccUserId,
    Notes,
    PRTId,
    startingCode,
  } = taskData;

  const newRepeatingTask = await prisma.masterTaskRepeat.create({
    data: {
      FromWeekNum,
      ToWeekNum,
      Interval,
      FromWeekNumIsPostProduction: false,
      ToWeekNumIsPostProduction: false,
    },
  });

  return prisma.masterTask.create({
    data: {
      Name,
      StartByWeekNum,
      CompleteByWeekNum,
      Priority,
      TaskAssignedToAccUserId,
      Notes,
      Code: startingCode,
      CopiedFrom: 'R',
      CopiedId: PRTId,
      MTRId: newRepeatingTask.Id,
    },
  });
}

async function createRegularTask(prisma: PrismaClient, taskData) {
  const { startingCode, ...task } = taskData;
  const filteredTask = omit(task, [
    'Id',
    'FromWeekNum',
    'ToWeekNum',
    'Interval',
    'ProductionId',
    'Progress',
    'CompleteByIsPostProduction',
    'StartByIsPostProduction',
    'PRTId',
  ]);

  return prisma.masterTask.create({
    data: {
      ...filteredTask,
      TaskStartByIsPostProduction: false,
      TaskCompleteByIsPostProduction: false,
      Code: startingCode,
      CopiedFrom: 'P',
      CopiedId: task.Id,
      Name: task.Name,
    },
  });
}

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { selectedTaskList } = req.body;
    const prisma = await getPrismaClient(req);

    // Get the starting code once
    const { Code: baseCode } = await getMaxMasterTaskCode(req);

    const result = await prisma.$transaction(async (tx: PrismaClient) => {
      const taskPromises = selectedTaskList.map((task, index) => {
        const taskData = {
          ...task,
          startingCode: baseCode + index + 1,
        };

        return !isNullOrEmpty(task.PRTId) ? createRepeatingTask(tx, taskData) : createRegularTask(tx, taskData);
      });

      return Promise.all(taskPromises);
    });

    return res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error creating Master Tasks' });
  }
}
