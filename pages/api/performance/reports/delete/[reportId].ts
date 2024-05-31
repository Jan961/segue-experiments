import { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const reportId = req.query.reportId as string;
    if (!reportId) {
      res.status(400).json({ ok: false, message: 'reportId is required' });
    }
    const result = await prisma.PerformanceReport.delete({
      where: {
        Id: parseInt(reportId, 10),
      },
    });
    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    res.status(500).json({ err: 'Error deleting reports' });
  }
}
