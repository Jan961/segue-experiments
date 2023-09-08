import { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'
import { PerformanceDTO } from 'interfaces'
import { dateStringToPerformancePair } from 'services/dateService'
import { performanceMapper } from 'lib/mappers'
import { getEmailFromReq, checkAccess } from 'services/userService'

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  try {
    const perf = req.body as PerformanceDTO
    const { BookingId } = perf

    const { Date, Time } = dateStringToPerformancePair(perf.Date)

    const email = await getEmailFromReq(req)
    const access = await checkAccess(email, { BookingId })
    if (!access) return res.status(401).end()

    const result = await prisma.performance.create({
      data: {
        Date,
        Time,
        Booking: {
          connect: {
            Id: perf.BookingId
          }
        }
      }
    })
    console.log(`Created Performance: ${result.Id}`)
    res.status(200).json(performanceMapper(result))
  } catch (e) {
    console.log(e)
    res.status(500).json({ err: 'Error Creating Performance' })
  }
}
