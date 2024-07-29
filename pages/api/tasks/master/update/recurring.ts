import { MasterTaskDTO } from 'interfaces';
import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getEmailFromReq, checkAccess } from 'services/userService';
import { generateSingleRecurringMasterTask } from '../../../../../services/TaskService';
import { omit } from 'radash';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const task = req.body as MasterTaskDTO;
      console.log(task);
      const email = await getEmailFromReq(req);
      const access = await checkAccess(email, { TaskId: task.Id });
      if (!access) return res.status(401).end();

      if (task.MTRId && task.RepeatInterval) {
        await prisma.MasterTask.update({
          data: {
            ...task,
          },
          where: {
            Id: task.Id,
          },
        });
      } else {
        const {
          RepeatInterval,
          TaskRepeatFromWeekNum,
          TaskRepeatToWeekNum,
          TaskStartByIsPostProduction,
          TaskEndByIsPostProduction,
          AccountId,
          AssignedToUserId,
        } = task;
        const repeatingTask = await prisma.MasterTaskRepeat.create({
          data: {
            Interval: RepeatInterval,
            FromWeekNum: TaskRepeatFromWeekNum,
            ToWeekNum: TaskRepeatToWeekNum,
            FromWeekNumIsPostProduction: TaskStartByIsPostProduction,
            ToWeekNumIsPostProduction: TaskEndByIsPostProduction,
          },
        });
        const mtrId = repeatingTask?.Id;
        let masterTaskData: any = await generateSingleRecurringMasterTask(req.body, repeatingTask.Id);
        masterTaskData = omit(masterTaskData, ['AssignedToUserId', 'MTRId']);
        console.log(masterTaskData);
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
            ...(mtrId && {
              MasterTaskRepeat: {
                connect: {
                  Id: mtrId,
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
