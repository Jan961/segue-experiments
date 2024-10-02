import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

import { generateSingleRecurringMasterTask } from 'services/TaskService';
import { omit } from 'radash';
import { masterTaskSchema, recurringMasterTaskSchema } from 'validators/tasks';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const task = req.body;
      const prisma = await getPrismaClient(req);

      if (task.MTRId && task.RepeatInterval) {
        await masterTaskSchema.validate(task);
        let filteredTaskObject = {
          ...task,
          ...(task.AccountId && {
            Account: {
              connect: {
                AccountId: task.AccountId,
              },
            },
          }),
          ...(task.TaskAssignedToAccUserId && {
            User: {
              connect: {
                Id: task.TaskAssignedToAccUserId,
              },
            },
          }),
          ...(task.MTRId && {
            MasterTaskRepeat: {
              connect: {
                Id: task.MTRId,
              },
            },
          }),
        };
        filteredTaskObject = omit(filteredTaskObject, [
          'Id',
          'AccountId',
          'TaskAssignedToAccUserId',
          'MTRId',
          'RepeatInterval',
          'TaskRepeatToWeekNum',
          'TaskRepeatFromWeekNum',
        ]);
        await prisma.masterTask.update({
          data: {
            ...filteredTaskObject,
          },
          where: {
            Id: task.Id,
          },
        });
      } else if (task.RepeatInterval) {
        const { RepeatInterval, TaskRepeatFromWeekNum, TaskRepeatToWeekNum, AccountId, TaskAssignedToAccUserId } = task;

        const masterTaskRepeatInfo = {
          Interval: RepeatInterval,
          FromWeekNum: TaskRepeatFromWeekNum,
          ToWeekNum: TaskRepeatToWeekNum,
          FromWeekNumIsPostProduction: false,
          ToWeekNumIsPostProduction: false,
        };
        await recurringMasterTaskSchema.validate(masterTaskRepeatInfo);
        const repeatingTask = await prisma.masterTaskRepeat.create({
          data: {
            ...masterTaskRepeatInfo,
          },
        });
        const MRTId = repeatingTask?.Id;
        let masterTaskData: any = await generateSingleRecurringMasterTask(req.body, repeatingTask.Id, req);

        await masterTaskSchema.validate({
          ...masterTaskData,
          TaskAssignedToAccUserId,
          MRTId,
          AccountId: task.AccountId,
        });

        masterTaskData = omit(masterTaskData, ['TaskAssignedToAccUserId', 'MTRId']);
        const createdTask = await prisma.masterTask.update({
          data: {
            ...masterTaskData,
            ...(task.AccountId && {
              Account: {
                connect: {
                  AccountId,
                },
              },
            }),
            ...(TaskAssignedToAccUserId && {
              User: {
                connect: {
                  Id: TaskAssignedToAccUserId,
                },
              },
            }),
            ...(MRTId && {
              MasterTaskRepeat: {
                connect: {
                  Id: MRTId,
                },
              },
            }),
          },
          where: { Id: task.Id },
        });

        res.status(200).json({ createdTask });
      }
    } catch (exception) {
      console.log(exception);
    }
    res.status(200).json({});
  }
}
