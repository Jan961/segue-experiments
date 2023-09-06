import prisma from 'lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  const Id = parseInt(req.query.venueId as string)
  try {
    const venue = await prisma.venue.findFirst(
      {
        where: {
          Id
        }
      }
    )
    res.status(200).json(venue)
  } catch (e) {
    res.status(500).json({ err: e })
  }
}
