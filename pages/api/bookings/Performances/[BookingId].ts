import { loggingService } from 'services/loggingService'
import prisma from 'lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  try {
    const searchResults = await prisma.performance.findMany({
      where: {
        BookingId: parseInt(req.query.BookingId as string)
      }
    })

    res.status(200).json(searchResults)
  } catch (err) {
    await loggingService.logError('Performance Issue' + err)
    res.status(403).json({ err: 'Error occurred while generating search results.' + err })
  }
}
