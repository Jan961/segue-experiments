import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
export default async function handle(req, res) {


    let TourId = parseInt(req.query.TourId)

/*
    TO be implimnented when Prisma supports this
    const result = await prisma.booking.findMany(
        {
            where:{
                TourId:   query,
                NOT: {
                    VenueId: null
                }

            },
            include:{
                Venue: true
            },
            orderBy: {
                ShowDate: "desc"
            },

        }
    )
    res.json(result)
 */
    let query = `SELECT DISTINCT Venue.VenueId, Venue.Name  FROM Booking LEFT JOIN Venue On Booking.VenueId = Venue.VenueId WHERE Booking.TourId =${TourId} AND Booking.VenueId IS NOT NULL;`
    try {
        let  result =  await prisma.$queryRawUnsafe(`${query}`)
        res.json(result)
        res.status(200)
    } catch (e){

        res.status(401)

    }

}