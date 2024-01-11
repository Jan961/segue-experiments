import { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  try {
    const result = await prisma.PerformanceReport.findMany({})
    res.status(200).json(result)
  } catch (e) {
    console.log(e)
    res.status(500).json({ err: 'Error fetching reports' })
  }
}