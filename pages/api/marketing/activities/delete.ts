import { loggingService } from 'services/loggingService'
import prisma from 'lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { ActivityDTO } from 'interfaces'

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = req.body as ActivityDTO

    await prisma.bookingActivity.delete({
      where: {
        Id: data.Id
      }
    })
    res.status(200).json({})
  } catch (err) {
    await loggingService.logError(err)
    console.log(err)
    res.status(500).json({ err: 'Error deleting BookingActivity' })
  }
}
