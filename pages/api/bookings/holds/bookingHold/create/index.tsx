import { loggingService } from 'services/loggingService'
import prisma from 'lib/prisma'

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
