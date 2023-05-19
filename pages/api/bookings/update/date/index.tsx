import { loggingService } from 'services/loggingService'
import prisma from 'lib/prisma'

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
