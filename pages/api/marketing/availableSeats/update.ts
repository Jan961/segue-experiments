import { loggingService } from 'services/loggingService'
import prisma from 'lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

interface UpdateAvailableSeatsParams {
  Id: number
  PerformanceId: number
  Seats: number
  Note: string
}

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  try {
    const x = req.body as UpdateAvailableSeatsParams

    await prisma.$transaction(async (tx) => {
      let existing = await tx.availableComp.findFirst({
        where: {
          PerformanceId: x.PerformanceId
        }
      })

      if (existing) {
        existing = await tx.availableComp.update({
          where: {
            Id: existing.Id
          },
          data: {
            Seats: x.Seats,
            AvailableCompNotes: x.Note
          }
        })
      } else {
        existing = await tx.availableComp.create({
          data: {
            PerformanceId: x.PerformanceId,
            Seats: x.Seats,
            AvailableCompNotes: x.Note
          }
        })
      }
    })

    res.status(200).json({})
  } catch (err) {
    await loggingService.logError(err)
    console.log(err)
    res.status(500).json({ err: 'Error updating AvailableComp' })
  }
}
