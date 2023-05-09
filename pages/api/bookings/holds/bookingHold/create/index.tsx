import {NextApiRequest, NextApiResponse} from "next";
import { PrismaClient } from '@prisma/client'
import {ca} from "date-fns/locale";
import {loggingService} from "../../../../../../services/loggingService";
const prisma = new PrismaClient()


export default async function handle(req, res) {

    console.log(req.body)
    try {
        const  createHolds = await prisma.bookingPromoterHoldAvailable.create({
            data: {
                BookingId: parseInt(req.body.BookingId),
                Performance: parseInt(req.body.Performance),
                Seats: parseInt(req.body.Seats),
                Notes: req.body.Notes,
            },
        })
        res.status(200).json(createHolds)
    } catch (e){

        loggingService.logError(e)
            .then(
                res.status(400)
            )

    }
}