import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    try {
      const prisma = await getPrismaClient(req);
      const taskId = parseInt(req.query.Id as string);
      if (!taskId) return res.status(401).json({ error: 'missing required params' });
      await prisma.productionTask.delete({
        where: {
          Id: taskId,
        },
      });
      res.status(200).json({ ok: true, message: 'Production task delete successful' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Error updating ProductionTask' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
