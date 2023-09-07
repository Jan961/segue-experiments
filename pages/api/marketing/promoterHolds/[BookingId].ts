import { AvailableComp } from '@prisma/client'
import { performanceMapper } from 'lib/mappers'
import prisma from 'lib/prisma'
import { getEmailFromReq, checkAccess } from 'services/userService'

export default async function handle (req, res) {
  try {
    const BookingId = parseInt(req.query.BookingId)

    const email = await getEmailFromReq(req)
    const access = await checkAccess(email, { BookingId })
    if (!access) return res.status(401)

    const performanceRaw = await prisma.performance.findMany({
      where: {
        BookingId
      },
      include: {
        AvailableComp: {
          include: {
            CompAllocation: true
          }
        }
      }
    })

    const result = []
    for (const p of performanceRaw) {
      const availableCompIds = p.AvailableComp.map((x: AvailableComp) => x.Id)

      const note = availableCompIds.length
        ? await prisma.note.findFirst({
          where: {
            OwnerId: availableCompIds[0],
            OwnerType: 'AvailableComp'
          }
        })
        : null

      let totalAllocated = 0
      let totalAvailable = 0
      const allocated = []
      let availableCompId: number

      for (const ac of p.AvailableComp) {
        totalAvailable += ac.Seats
        availableCompId = ac.Id

        for (const ca of ac.CompAllocation) {
          allocated.push(ca)
          totalAllocated += ca.Seats
        }
      }

      result.push({
        info: performanceMapper(p),
        note: note ? note.Text : '',
        availableCompId,
        totalAvailable,
        totalAllocated,
        allocated
      })
    }

    res.json(result)
  } catch (err) {
    console.log(err)
    res.status(500).json({ err: 'Error occurred while generating search results.' })
  }
}
