import {NextApiRequest, NextApiResponse} from "next";
import { PrismaClient } from '@prisma/client'
import {loggingService} from "../../../../../services/loggingService";
const prisma = new PrismaClient()


export default async function handle(req, res) {

    try {
        
        const searchResults = await prisma.bookingPerformance.findMany({
            where: {
                BookingId:  parseInt(req.query.BookingId)
            },
        })

        res.status(200).json(searchResults)

    } catch (err) {
        await loggingService.logError("Performance Issue" + err)
        res.status(403).json({ err: "Error occurred while generating search results." + err});
    }

}
