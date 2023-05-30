import prisma from 'lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  const query: number = parseInt(req.query.tourId as string)
  try {
    await prisma.tour.update({
      where: {
        Id: query
      },
      data: {
        IsDeleted: true
      }
    })
    res.status(200).end()
  } catch (e) {
    console.log(e)
    res.status(500).json({ err: 'Error occurred while deleting tour.' })
  }
}
