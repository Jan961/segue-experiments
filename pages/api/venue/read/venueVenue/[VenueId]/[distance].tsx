
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

/**
 *
 * Default query using Prisma to provide ORM
 *
 *
 *
 * @param req
 * @param res
 */
export default async function handle(req, res) {


    let VenueId: number = parseInt(req.query.VenueId)
    let Distance: number = parseInt(req.query.distance)
    try {
        /**
        const venueList = await prisma.venueVenue.findMany({
            include: { Venue: true },
            where: {
                AND: [
                    { Venue1Id: VenueId },
                    { Mileage: { lte: Distance } }
                ]
            },
        });




         SELECT *
         FROM VenueVenue
         LEFT JOIN Venue
         ON VenueVenue.Venue2Id = Venue.VenueId
         WHERE VenueVenue.Venue2Id NOT IN (SELECT BarredVenueId FROM VenueBarredVenue WHERE VenueBarredVenue.VenueId = 331)
         AND VenueView.VenueId = 331;


         SELECT *
         FROM VenueVenue as vv
         WHERE vv.Venue2Id NOT IN (SELECT BarredVenueId as bv FROM VenueBarredVenue as vbv WHERE vbv.`VenueId` = 561)
         AND vv.Venue1Id = 561;

         const result = await prisma.venueVenue.findMany({
    where: {
        AND: [
            {venue1Id: 561},
            {
                venue2Id: {
                    NOT: {
                        IN:
                            prisma.venueBarredVenue.findMany({
                                select: {barredVenueId: true},
                                where: {venueId: 561}
                            })
                            .then(res => res.map(r => r.barredVenueId))
                    }
                }
            }
        ]
    }
});



         SELECT * FROM `VenueVenue`
         LEFT JOIN Venue
         ON VenueVenue.Venue2Id = Venue.VenueId
         WHERE VenueVenue.`Venue2Id`
         NOT in (SELECT BarredVenueId
         FROM `VenueBarredVenue`
         WHERE `VenueId` = 651)
         AND VenueVenue.`Venue2Id` = 561
         AND VenueVenue.`Mileage` <= 50;

         */
        const venueList = await prisma.$queryRaw`SELECT * FROM \`VenueVenue\` LEFT JOIN Venue ON VenueVenue.Venue1Id = Venue.VenueId WHERE VenueVenue.\`Venue1Id\` NOT in (SELECT BarredVenueId FROM \`VenueBarredVenue\` WHERE VenueId = ${VenueId}) AND VenueVenue.Venue2Id = ${VenueId} AND VenueVenue.\`Mileage\` <= ${Distance}`


        res.json(venueList)
        res.status(200).end();
    }

    catch (error) {
        res.json(error);
        res.status(405).end();
    }

}