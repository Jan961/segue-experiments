import prisma from 'lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { getTourByCode } from 'services/TourService'

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  const { TourCode, ShowCode } = req.query

  if (!TourCode || !ShowCode) return res.end(400)

  try {
    const result = getTourByCode(ShowCode as string, TourCode as string)
    res.json(result)
  } catch (e) {
    console.log(e)
  }
}
