import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()


/**
 * Get the Latitude and Longitude for a venue
 * @param req
 * @param res
 */
export default  async function handle(req, res) {

    let VenueId = parseInt(req.query.VenueId)
    
    let coords = await prisma.venue.findFirst({
        where: {
            VenueId: VenueId
        },
        select: {
            Latitude: true,
            Longitude: true
        }
    })

    res.status(200).json(coords)

}


