import {NextApiRequest, NextApiResponse} from "next";
import { PrismaClient } from '@prisma/client'
import {ca} from "date-fns/locale";
import {loggingService} from "../../../../services/loggingService";
const prisma = new PrismaClient()


export default async function handle(req, res) {

    try {
        const  updateBooking = await prisma.booking.update({
            where:{
                BookingId: req.body.BookingId
            },
            data: {
               VenueId: req.body.VenueId,
                Notes:req.body.Notes,
                DateTypeId:req.body.DateTypeId,
                BookingStatus:req.body.BookingStatus,
                DayTypeCast: req.body.DayTypeCast,
                LocationCast: req.body.LocationCast,
                DayTypeCrew: req.body.DayTypeCast,
                LocationCrew: req.body.LocationCrew,
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