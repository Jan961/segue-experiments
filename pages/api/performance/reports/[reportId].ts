import { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'
import { PerformanceReport } from '@prisma/client';

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  try {
    const reportId = req.query.reportId
    if(!reportId) return res.status(401).end();
    const result:PerformanceReport = await prisma.PerformanceReport.findFirst({
      PRPerformanceId:reportId
    })
    res.status(200).json(result)
  } catch (e) {
    console.log(e)
    res.status(500).json({ err: 'Error fetching report' })
  }
}
