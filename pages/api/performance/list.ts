import { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'
import { PerformanceReport } from '@prisma/client';

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  try {
    const result:PerformanceReport[] = await prisma.PerformanceReport.findMany({})
    res.status(200).json(result)
  } catch (e) {
    console.log(e)
    res.status(500).json({ err: 'Error fetching report' })
  }
}