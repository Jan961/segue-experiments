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
                VenueId: parseInt(req.body.VenueId),
                Notes:req.body.Notes,
                BookingStatus:req.body.BookingStatus,
                DayTypeCast: parseInt(req.body.DayTypeCast),
                LocationCast: req.body.LocationCast,
                DayTypeCrew: parseInt(req.body.DayTypeCast),
                LocationCrew: req.body.LocationCrew,
            },
        })
        console.log(updateBooking)
        res.json(updateBooking)
    } catch (e){

        loggingService.logError(e)
            .then(
                res.status(400)
            )

    }
}
