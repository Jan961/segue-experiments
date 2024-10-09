import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getMaxMasterTaskCode } from 'services/TaskService';
import { isNullOrEmpty } from 'utils';
import { omit } from 'radash';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { selectedTaskList } = req.body;
    const prisma = await getPrismaClient(req);

    const taskList = selectedTaskList.map(async (task) => {
      const { Code } = await getMaxMasterTaskCode(req);
      if (!isNullOrEmpty(task.PRTId)) {
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
        } = task;

        const newRepeatingTask = await prisma.masterTaskRepeat.create({
          data: {
            FromWeekNum,
            ToWeekNum,
            Interval,
            FromWeekNumIsPostProduction: false,
            ToWeekNumIsPostProduction: false,
          },
        });

        return await prisma.masterTask.create({
          data: {
            Name,
            StartByWeekNum,
            CompleteByWeekNum,
            Priority,
            TaskAssignedToAccUserId,
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
        return await prisma.masterTask.create({
          data: {
            ...filteredTask,
            TaskStartByIsPostProduction: false,
            TaskCompleteByIsPostProduction: false,
            Code: Code + 1,
            CopiedFrom: 'P',
            CopiedId: task.Id,
            Name: task.Name,
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
