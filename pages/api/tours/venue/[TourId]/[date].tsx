import { PrismaClient } from '@prisma/client'
import {dateService} from "../../../../../services/dateService";
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

    const TourId =  parseInt(req.query.TourId)
    // Convert Show Date ito datetime
    const ShowDate = dateService.toTimestamo(res.query.date)


    try {
        const searchResults = await prisma.booking.findFirst({
            where: {
                ShowDate: ShowDate,
                TourId: TourId,
            },
          })

        res.json(searchResults)


    } catch (err) {
        console.log(err);
        res.status(403).json({ err: "Error occurred while generating search results." });
    }
}