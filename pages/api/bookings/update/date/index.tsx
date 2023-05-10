import {NextApiRequest, NextApiResponse} from "next";
import { PrismaClient } from '@prisma/client'
import {ca} from "date-fns/locale";
import {loggingService} from "../../../../../services/loggingService";
const prisma = new PrismaClient()


export default async function handle(req, res) {

    console.log(req.body)

    try {
        const  updateBooking = await prisma.booking.update({
            where:{
                BookingId: req.body.BookingId
            },
            data: {
                ShowDate: req.body.ShowDate,
            },
        })
        res.status(200).json(updateBooking)
    } catch (e){

        loggingService.logError(e)
            .then(
                res.status(400)
            )

    }
}