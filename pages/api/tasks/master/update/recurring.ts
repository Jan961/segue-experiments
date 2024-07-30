import { MasterTaskDTO } from 'interfaces';
import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getEmailFromReq, checkAccess } from 'services/userService';
import { generateSingleRecurringMasterTask } from '../../../../../services/TaskService';
import { omit } from 'radash';
import { masterTaskSchema, recurringMasterTaskSchema } from '../../../../../validators/tasks';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const task = req.body as MasterTaskDTO;
      const email = await getEmailFromReq(req);
      const access = await checkAccess(email, { TaskId: task.Id });
      if (!access) return res.status(401).end();

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
          ...(task.AssignedToUserId && {
            User: {
              connect: {
                Id: task.AssignedToUserId,
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
          'AssignedToUserId',
          'MTRId',
          'RepeatInterval',
          'TaskRepeatToWeekNum',
          'TaskRepeatFromWeekNum',
        ]);
        await prisma.MasterTask.update({
          data: {
            ...filteredTaskObject,
          },
          where: {
            Id: task.Id,
          },
        });
      } else if (task.RepeatInterval) {
        const { RepeatInterval, TaskRepeatFromWeekNum, TaskRepeatToWeekNum, AccountId, AssignedToUserId } = task;

        const masterTaskRepeatInfo = {
          Interval: RepeatInterval,
          FromWeekNum: TaskRepeatFromWeekNum,
          ToWeekNum: TaskRepeatToWeekNum,
          FromWeekNumIsPostProduction: false,
          ToWeekNumIsPostProduction: false,
        };
        await recurringMasterTaskSchema.validate(masterTaskRepeatInfo);
        const repeatingTask = await prisma.MasterTaskRepeat.create({
          data: {
            ...masterTaskRepeatInfo,
          },
        });
        const MRTId = repeatingTask?.Id;
        let masterTaskData: any = await generateSingleRecurringMasterTask(req.body, repeatingTask.Id);

        await masterTaskSchema.validate({ ...masterTaskData, AssignedToUserId, MRTId, AccountId: task.AccountId });

        masterTaskData = omit(masterTaskData, ['AssignedToUserId', 'MTRId']);
        const createdTask = await prisma.MasterTask.update({
          data: {
            ...masterTaskData,
            ...(task.AccountId && {
              Account: {
                connect: {
                  AccountId,
                },
              },
            }),
            ...(AssignedToUserId && {
              User: {
                connect: {
                  Id: AssignedToUserId,
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
