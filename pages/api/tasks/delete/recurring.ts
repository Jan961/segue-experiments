import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { taskId, selectOption, PRTId, weekStart } = req.body;
      console.log(selectOption);
      if (!taskId) return res.status(401).json({ error: 'missing required params' });
      switch (selectOption) {
        case 'Delete this occurrence only': {
          await prisma.ProductionTask.delete({
            where: {
              Id: taskId,
            },
          });

          return res.status(200).json({ ok: true, message: 'Production task delete successful' });
        }

        case 'Delete this and all future occurrence of this task': {
          await prisma.ProductionTask.delete({
            where: {
              Id: taskId,
              PRTId,
              StartByWeekNum: { gte: weekStart },
            },
          });

          return res.status(200).json({ ok: true, message: 'Production task delete successful' });
        }

        case 'Delete every occurrence of this task': {
          await prisma.ProductionTask.delete({
            where: {
              PRTId,
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
