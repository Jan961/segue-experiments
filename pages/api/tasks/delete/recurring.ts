import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { taskId, selectOption, PRTId, weekStart } = req.body;
      const prisma = await getPrismaClient(req);
      if (!taskId) return res.status(401).json({ error: 'missing required params' });
      switch (selectOption) {
        case 'Delete this occurrence only': {
          await prisma.productionTask.delete({
            where: {
              Id: taskId,
            },
          });

          return res.status(200).json({ ok: true, message: 'Production task delete successful' });
        }

        case 'Delete this and all future occurrence of this task': {
          const tasksToDelete: number[] = (
            await prisma.productionTask.findMany({
              where: {
                PRTId,
                StartByWeekNum: { gte: weekStart },
              },
              select: {
                Id: true,
              },
            })
          ).map((task) => task.Id);
          await prisma.productionTask.deleteMany({
            where: {
              Id: { in: tasksToDelete },
            },
          });

          return res.status(200).json({ ok: true, message: 'Production task delete successful' });
        }

        case 'Delete every occurrence of this task': {
          const tasksToDelete: number[] = (
            await prisma.productionTask.findMany({
              where: {
                PRTId,
              },
              select: {
                Id: true,
              },
            })
          ).map((task) => task.Id);
          await prisma.productionTask.deleteMany({
            where: {
              Id: { in: tasksToDelete },
            },
          });

          return res.status(200).json({ ok: true, message: 'Production task delete successful' });
        }

        default: {
          return res.status(500).json({ error: 'Error updating ProductionTask' });
        }
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Error updating ProductionTask' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
