import { NextApiRequest } from 'next';
import { generateRecurringProductionTasks } from 'services/TaskService';
import { calculateWeekNumber } from 'services/dateService';
import { omit } from 'radash';
import { Prisma } from '@prisma/client';

export interface SelectedTask {
  Id?: number;
  MTRId?: number;
  Name: string;
  StartByWeekNum: number;
  CompleteByWeekNum: number;
  Priority: number;
  TaskAssignedToAccUserId?: number;
  Notes?: string;
  RepeatInterval?: number;
  TaskRepeatFromWeekNum?: number;
  TaskRepeatToWeekNum?: number;
}

export const handleRecurringTask = async (
  task: SelectedTask,
  ProductionId: number,
  productionWeeks: { StartDate: Date; EndDate: Date },
  prodStartDate: Date,
  counter: number,
  req: NextApiRequest,
  tx: Prisma.TransactionClient,
) => {
  // Create recurring task record
  const recurringTaskRecord = {
    FromWeekNum: task.TaskRepeatFromWeekNum,
    ToWeekNum: task.TaskRepeatToWeekNum,
    Interval: task.RepeatInterval,
    FromWeekNumIsPostProduction: false,
    ToWeekNumIsPostProduction: false,
  };

  const newRepeatingTask = await tx.productionTaskRepeat.create({
    data: recurringTaskRecord,
  });

  const recurringTaskInfo = {
    Name: task.Name,
    StartByWeekNum: task.StartByWeekNum,
    CompleteByWeekNum: task.CompleteByWeekNum,
    Priority: task.Priority,
    Progress: 0,
    RepeatInterval: task.RepeatInterval,
    TaskRepeatFromWeekNum: task.TaskRepeatFromWeekNum,
    TaskRepeatToWeekNum: task.TaskRepeatToWeekNum,
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

  // Create all production tasks sequentially within the transaction
  const createdTasks = [];
  for (const newTask of newProdTasks) {
    const createdTask = await tx.productionTask.create({
      data: {
        ...newTask,
        CopiedFrom: 'D',
        CopiedId: task.MTRId,
      },
    });
    createdTasks.push(createdTask);
  }

  return createdTasks;
};

export const handleSingleTask = async (
  task: SelectedTask,
  ProductionId: number,
  prodStartDate: Date,
  prodEndDate: Date,
  index: number,
  tx: Prisma.TransactionClient,
  baseCode: number,
) => {
  const Code = baseCode + index + 1;

  const weeksCalculation = calculateWeekNumber(prodStartDate, prodEndDate);
  const taskCompleteBys = {
    StartByIsPostProduction: task.StartByWeekNum < 0 ? false : task.StartByWeekNum > weeksCalculation,
    CompleteByIsPostProduction: task.CompleteByWeekNum < 0 ? false : task.CompleteByWeekNum > weeksCalculation,
  };

  const fieldsToOmit = [
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
  ];

  const filteredTask = omit(task, fieldsToOmit as (keyof SelectedTask)[]);

  return await tx.productionTask.create({
    data: {
      ...filteredTask,
      ...taskCompleteBys,
      Code,
      Production: { connect: { Id: ProductionId } },
      CopiedFrom: 'M',
      CopiedId: task.Id,
      Progress: 0,
      TaskCompletedDate: null,
      Name: task.Name,
    },
  });
};
