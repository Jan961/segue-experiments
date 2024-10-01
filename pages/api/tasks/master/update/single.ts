import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { omit } from 'radash';
import { isNullOrEmpty } from 'utils';
import { masterTaskSchema } from 'validators/tasks';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    let task = req.body;
    const prisma = await getPrismaClient(req);
    const { Id, TaskAssignedToAccUserId, MTRId } = task;
    await masterTaskSchema.validate(task);
    if (isNullOrEmpty(MTRId)) {
      task = omit(task, ['Id', 'AccountId', 'TaskAssignedToAccUserId', 'MTRId', 'MasterTaskRepeat']);
      const createResult = await prisma.masterTask.update({
        data: {
          ...task,
          ...(task.TaskAssignedToAccUserId && {
            User: {
              connect: {
                Id: TaskAssignedToAccUserId,
              },
            },
          }),
          MTRId,
        },
        where: { Id },
      });
      res.status(200).json(createResult);
    } else {
      const strippedTask = omit(task, [
        'Id',
        'MasterTaskRepeat',
        'AccountId',
        'TaskAssignedToAccUserId',
        'MTRId',
        'TaskRepeatFromWeekNum',
        'TaskRepeatToWeekNum',
        'TaskStartByIsPostProduction',
        'TaskEndByIsPostProduction',
      ]);

      const updatedTask = await prisma.masterTask.update({
        data: {
          ...strippedTask,
          MTRId: null,
          ...(TaskAssignedToAccUserId && {
            User: {
              connect: {
                Id: TaskAssignedToAccUserId,
              },
            },
          }),
        },
        where: { Id },
      });

      await prisma.masterTaskRepeat.delete({ where: { Id: MTRId } });

      res.status(200).json({ updatedTask });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error creating Master Task' });
  }
}
