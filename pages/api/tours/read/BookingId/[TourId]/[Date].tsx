import {NextApiRequest, NextApiResponse} from "next";
import { PrismaClient } from '@prisma/client'
import {dateService} from "../../../../../../services/dateService";
const prisma = new PrismaClient()

/**
 * SELECT * FROM `Booking` WHERE `TourId` = 4 AND `ShowDate` LIKE '%2022-02-07%'
 *
 * @param req
 * @param res
 */
export default async function handle(req, res) {

    try {

        let tourID = parseInt(req.query.TourId)
        let date = dateService.toSql(req.query.Date)
        const bookings = await prisma.booking.findFirst({
            where: {
                TourId: tourID,
                ShowDate:{
                    /**
                     * This is required due to prismas handeling of dates
                     */
                    lte: new Date(date).toISOString(), // "2022-01-30T00:00:00.000Z"
                    gte: new Date(date).toISOString(), // "2022-01-15T00:00:00.000Z"
                }
            }
        });

        res.json(bookings)

    } catch (err) {
        console.log(err);
        res.status(403).json({ err: "Error occurred while generating search results." });
    }

}
