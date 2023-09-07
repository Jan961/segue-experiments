import prisma from 'lib/prisma'
import { PerformanceDTO } from 'interfaces'
import { performanceMapper } from 'lib/mappers'
import { dateStringToPerformancePair } from 'services/dateService'
import { getEmailFromReq, checkAccess } from 'services/userService'

export default async function handle (req, res) {
  try {
    const perf = req.body as PerformanceDTO

    const email = await getEmailFromReq(req)
    const access = await checkAccess(email, { PerformanceId: perf.Id })
    if (!access) return res.status(401).end()

    const { Date, Time } = dateStringToPerformancePair(perf.Date)
    const result = await prisma.performance.update({
      where: {
        Id: perf.Id
      },
      data: {
        Time,
        Date
      }
    })
    res.status(200).json(performanceMapper(result))
  } catch (err) {
    console.log(err)
    res.status(500).json({ err: 'Error occurred creating performance.' })
  }
}
