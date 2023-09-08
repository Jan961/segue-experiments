import { NextApiRequest, NextApiResponse } from 'next'
import prisma from 'lib/prisma'
import { PerformanceDTO } from 'interfaces'
import { getEmailFromReq, checkAccess } from 'services/userService'

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  try {
    const perf = req.body as PerformanceDTO

    const email = await getEmailFromReq(req)
    const access = await checkAccess(email, { PerformanceId: perf.Id })
    if (!access) return res.status(401).end()

    await prisma.$transaction([
      prisma.performance.delete({
        where: {
          Id: perf.Id
        }
      })
    ])
    console.log(`Deleted Performance: ${perf.Id}`)
    res.status(200).json({})
  } catch (e) {
    console.log(e)
    res.status(500).json({ err: 'Error Deleting Performance' })
  }
}
