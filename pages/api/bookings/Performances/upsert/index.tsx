import { loggingService } from 'services/loggingService'
import prisma from 'lib/prisma'

export default async function handle (req, res) {
  try {
    let upsertPerormance
    if (req.body.PerfomanceId !== null) {
      upsertPerormance = await prisma.bookingPerformance.update({
        where: {
          PerformanceId: parseInt(req.body.PerfomanceId)
        },
        data: {
          Time: new Date('06/06/1970 ' + req.body.Time)
        }
      })
    } else {
      upsertPerormance = await prisma.bookingPerformance.create({
        data: {
          Time: new Date('06/06/1970 ' + req.body.Time),
          BookingId: parseInt(req.body.BookingId),
          PerformanceId: null // Insert
        }
      })
    }
    res.status(200).json(upsertPerormance)
  } catch (err) {
    await loggingService.logError('Performance Create Update' + err)
    res.status(403).json({ err: 'Error occurred while generating search results.' + err })
  }
}
