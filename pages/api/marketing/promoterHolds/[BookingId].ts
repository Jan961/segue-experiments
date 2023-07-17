import { performanceMapper } from 'lib/mappers'
import prisma from 'lib/prisma'

export default async function handle (req, res) {
  try {
    const BookingId = parseInt(req.query.BookingId)
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

    const result = performanceRaw.map((p) => {
      let totalAllocated = 0
      let totalAvailable = 0
      const allocated = []

      for (const ac of p.AvailableComp) {
        totalAvailable += ac.Seats

        for (const ca of ac.CompAllocation) {
          allocated.push(ca)
          totalAllocated += ca.Seats
        }
      }

      return {
        info: performanceMapper(p),
        totalAvailable,
        totalAllocated,
        allocated
      }
    })

    res.json(result)
  } catch (err) {
    console.log(err)
    res.status(500).json({ err: 'Error occurred while generating search results.' })
  }
}
