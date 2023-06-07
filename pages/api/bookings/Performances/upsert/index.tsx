import { loggingService } from 'services/loggingService'
import prisma from 'lib/prisma'
import { PerformanceDTO } from 'interfaces'
import { performanceMapper } from 'lib/mappers'
import { Performance as PerformanceType } from '@prisma/client'

export default async function handle (req, res) {
  try {
    const data = req.body as PerformanceDTO

    const datePart = data.Date.split('T')[0]
    const timePart = data.Date.split('T')[1]

    console.log(datePart)

    const defaultDatePart = '1970-01-01'

    let result: PerformanceType
    if (req.body.PerfomanceId !== null) {
      result = await prisma.performance.update({
        where: {
          Id: data.Id
        },
        data: {
          Time: new Date(`${defaultDatePart} ${timePart}`),
          Date: new Date(`${datePart}`)
        }
      })
    } else {
      result = await prisma.performance.create({
        data: {
          Time: new Date(`${defaultDatePart} ${timePart}`),
          Date: new Date(`${datePart}`),
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
