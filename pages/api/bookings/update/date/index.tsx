import { NextApiRequest, NextApiResponse } from 'next'
import { swapBookings } from 'services/bookingService'
import { loggingService } from 'services/loggingService'


export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  const { sourceId, destinationId } = req.body

  try {
    const results = await swapBookings(parseInt(sourceId), parseInt(destinationId))
    res.status(200).json(results)
  } catch (e) {
    console.log(e)
    loggingService.logError(e)
      .then(
        res.status(400)
      )
  }
}
