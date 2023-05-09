import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

/**
 *
 * Default query using Prisma to provide ORM
 *
 *
 * @param req ShowID
 * @param res
 */
export default async function handle(req, res) {

    /**
     *
     * SELECT Venue.Code, Venue.Name, Venue.Seats, Venue.Country FROM `Booking`
     * LEFT JOIN Venue
     * ON Booking.VenueId = Venue.VenueId
     * WHERE `TourId` = 4
     * AND Venue.VenueId
     * IS NOT null GROUP BY Booking.VenueId;
     *
     */

    let query: number = parseInt(req.query.TourId)

    const result = await prisma.booking.findMany(
        {
            distinct: ['VenueId'],
            select: {
                TourId: true,
                Venue: {
                    select: {
                        Code: true,
                        Name: true,
                        Seats: true,
                        Country: true,
                    },
                },
            },
            where:{
                TourId: query,
                NOT:{
                    VenueId:{
                        equals: null
                    }
                }
            },

        }
    )
    res.json(result)
}