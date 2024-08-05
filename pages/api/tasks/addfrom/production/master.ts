import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getEmailFromReq, checkAccess, getAccountIdFromReq } from 'services/userService';
import { getMaxMasterTaskCode } from 'services/TaskService';
import { isNullOrEmpty } from 'utils';
import { omit } from 'radash';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { selectedTaskList, ProductionId } = req.body;

    const email = await getEmailFromReq(req);
    const access = await checkAccess(email, { ProductionId });
    const AccountId = await getAccountIdFromReq(req);
    if (!access) return res.status(401).end();

    const taskList = selectedTaskList.map(async (task) => {
      const { Code } = await getMaxMasterTaskCode();
      if (!isNullOrEmpty(task.PRTId)) {
        const {
          Interval,
          FromWeekNum,
          ToWeekNum,
          Name,
          StartByWeekNum,
          CompleteByWeekNum,
          Priority,
          AssignedToUserId,
          Notes,
        } = task;

        const newRepeatingTask = await prisma.MasterTaskRepeat.create({
          data: {
            FromWeekNum,
            ToWeekNum,
            Interval,
            FromWeekNumIsPostProduction: false,
            ToWeekNumIsPostProduction: false,
          },
        });

        return await prisma.MasterTask.create({
          data: {
            AccountId,
            Name,
            StartByWeekNum,
            CompleteByWeekNum,
            Priority,
            AssignedToUserId,
            Notes,
            Code: Code + 1,
            CopiedFrom: 'R',
            CopiedId: task.PRTId,
            MTRId: newRepeatingTask.Id,
          },
        });
      } else {
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
        return await prisma.MasterTask.create({
          data: {
            ...filteredTask,
            AccountId,
            TaskStartByIsPostProduction: false,
            TaskCompleteByIsPostProduction: false,
            Code: Code + 1,
            CopiedFrom: 'P',
            CopiedId: task.Id,
          },
        });
      }
    });

    return res.status(200).json(taskList);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error creating adding from Master Task' });
  }
}
