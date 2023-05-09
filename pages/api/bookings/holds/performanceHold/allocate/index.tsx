import {NextApiRequest, NextApiResponse} from "next";
import { PrismaClient } from '@prisma/client'
import {ca} from "date-fns/locale";
import {loggingService} from "../../../../../../services/loggingService";
const prisma = new PrismaClient()


export default async function handle(req, res) {

    try {
        const  createHolds = await prisma.bookingPromoterHoldAllocation.create({
            data:{
                AvailableHoldId: parseInt(req.query.AvailableHoldId),
                TicketHolderName: req.body.TicketHolderName,
                TicketHolderEmail: req.body.TicketHolderEmail,
                Seats: req.body.Seats,
                RequestedBy: req.body.RequestedBy,
                ArrangedBy: req.body.ArrangedBy,
                VenueConfirmationNotes: req.body.VenueConfirmationNotes,
                Comments: req.body.Comments,
                SeatsAllocated: req.body.SeatsAllocated,
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