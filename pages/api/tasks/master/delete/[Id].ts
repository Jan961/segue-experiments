import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    try {
      const taskId = parseInt(req.query.Id as string);
      const prisma = await getPrismaClient(req);
      if (!taskId) return res.status(401).json({ error: 'missing required params' });
      await prisma.masterTask.delete({
        where: {
          Id: taskId,
        },
      });
      res.status(200).json({ ok: true, message: 'Master task delete successful' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: 'Error updating ProductionTask' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
