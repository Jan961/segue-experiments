import { loggingService } from 'services/loggingService'
import prisma from 'lib/prisma'
import { VenueContactDTO } from 'interfaces'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  try {
    const vc = req.body as VenueContactDTO

    await prisma.venueContact.delete({
      where: {
        Id: vc.Id
      }
    })
    res.status(200).json({})
  } catch (err) {
    await loggingService.logError(err)
    console.log(err)
    res.status(500).json({ err: 'Error updating VenueContact' })
  }
}
