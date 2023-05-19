import prisma from 'lib/prisma'

export default async function handle(req, res) {

    try {
        let data = JSON.parse(req.body)
        let BookingId = parseInt(data.BookingId)
        let TourId =  parseInt(data.TourId)

        const latestBooking:any =  await prisma.booking.findFirst({

            where: {
                BookingId: { lt: BookingId },
                TourId: TourId,
                VenueId: { not: null },
            },
            orderBy: {
                ShowDate: 'desc',
            },
        });
        //console.log(latestBooking)
        res.json(latestBooking)

    } catch (err) {
        console.log(err);
        res.status(400).json({ err: "Error occurred while generating results." });
    }

}
