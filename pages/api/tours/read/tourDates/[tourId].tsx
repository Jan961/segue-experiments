import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

/**
 *
 * Return a list of Dates within a tour that are "gaps"
 * A gap is a day that is within the tour (Between Tour Start and tour End)
 * that is not set as rehersal, show of fit-up
 *
 *
 * @param req TourID
 * @param res
 */
export default async function handle(req, res) {

    /**
     * Get Tour Dates adapted from below
     *
     * Exampel of tour ID 4
     *
     * SELECT * FROM `Booking`
     * LEFT JOIN Tour
     * ON Booking.TourId = Tour.TourId
     * WHERE  Tour.TourId = 4
     * AND`VenueId` IS NULL
     * AND `Performance1Time` IS NULL
     * AND ShowDate
     * BETWEEN Tour.TourStartDate AND TourEndDate
     * AND DateTypeId = 1 OR DateTypeId = 17;
     *
     * this needs a date to be booked to allow holds
     *
     */

    let query: number = parseInt(req.query.tourId)

    /**
     * Simole qyerey to get the tour Start and End Date
     *
     */
    const tourdates = await prisma.tour.findFirst(
        {where:{
            TourId: query
            }
        }
    )

    const result = await prisma.booking.findMany(
        {
            where: {
                AND: [
                    { TourId: query },
                    /**
                     * get indication of dates not currently booked
                     */
                    { VenueId: {
                        not: null}
                        },
                    { Performance1Time: {
                        not: null
                        }
                    },
                    { ShowDate: {
                            /**
                             * Use Dates from simple query to create constraint of Tour Start And End
                             */
                            gte: tourdates.TourStartDate,
                            lte: tourdates.TourEndDate,
                        }
                        },
                    { OR: [
                            /**
                             * List of day types that can be used for new bookings to make sure
                             * dates are not taken by Meta Days
                             */
                            { DateTypeId: 1  }, // Null
                            { DateTypeId:  17  } // TBA
                        ]
                    }
                ]
            },
            include:{
                Venue: true
            }

        }
    )
    res.json(result)
}