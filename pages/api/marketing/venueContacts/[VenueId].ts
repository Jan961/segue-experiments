import { venueContactMapper } from 'lib/mappers'
import prisma from 'lib/prisma'

export default async function handle (req, res) {
  try {
    const VenueId = parseInt(req.query.VenueId)
    const results = await prisma.venueContact.findMany({
      where: {
        VenueId
      }
    })

    res.json(results.map(venueContactMapper))
  } catch (err) {
    console.log(err)
    res.status(500).json({ err: 'Error occurred while generating search results.' })
  }
}
