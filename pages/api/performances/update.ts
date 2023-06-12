import { loggingService } from 'services/loggingService'
import prisma from 'lib/prisma'
import { PerformanceDTO } from 'interfaces'
import { performanceMapper } from 'lib/mappers'
import { Performance as PerformanceType } from '@prisma/client'
import { dateStringToPerformancePair } from 'services/dateService'

export default async function handle (req, res) {
  try {
    const data = req.body as PerformanceDTO

    const { Date, Time } = dateStringToPerformancePair(data.Date)

    let result: PerformanceType
    if (req.body.PerfomanceId !== null) {
      result = await prisma.performance.update({
        where: {
          Id: data.Id
        },
        data: {
          Time,
          Date
        }
      })
    } else {
      result = await prisma.performance.create({
        data: {
          Time,
          Date,
          BookingId: data.BookingId,
          Id: null // Insert
        }
      })
    }

    res.status(200).json(performanceMapper(result))
  } catch (err) {
    await loggingService.logError('Performance Create Update' + err)
    console.log(err)
    res.status(500).json({ err: 'Error occurred while generating search results.' + err })
  }
}
