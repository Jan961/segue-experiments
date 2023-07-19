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

    console.log(x)

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
            Seats: x.Seats
          }
        })
      } else {
        existing = await tx.availableComp.create({
          data: {
            PerformanceId: x.PerformanceId,
            Seats: x.Seats
          }
        })
      }

      const note = await tx.note.findFirst({
        where: {
          OwnerId: existing.Id,
          OwnerType: 'AvailableComp'
        }
      })

      // Update Note
      if (note) {
        await tx.note.update({
          where: { Id: note.Id },
          data: {
            Text: x.Note
          }
        })
      } else {
        await tx.note.create({
          data: {
            OwnerId: existing.Id,
            OwnerType: 'AvailableComp',
            TypeName: 'Main',
            Text: x.Note
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
