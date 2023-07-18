import { loggingService } from 'services/loggingService'
import prisma from 'lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

interface UpdateAvailableSeatsParams {
  PerformanceId: number
  Seats: number
}

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  try {
    const x = req.body as UpdateAvailableSeatsParams

    await prisma.availableComp.upsert({
      where: {
        Id: x.PerformanceId
      },
      update: {
        Seats: x.Seats
      },
      create: {
        PerformanceId: x.PerformanceId,
        Seats: x.Seats
      }
    })
    res.status(200).json({})
  } catch (err) {
    await loggingService.logError(err)
    console.log(err)
    res.status(500).json({ err: 'Error updating AvailableComp' })
  }
}
