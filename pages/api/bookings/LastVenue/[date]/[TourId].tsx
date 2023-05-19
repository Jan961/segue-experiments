import prisma from 'lib/prisma'

export default async function handle(req, res) {

    try {

        let date = new Date(req.query.date)
        let tourId = req.query.tourId

        const latestBooking:any =  await prisma.booking.findFirst({

            where: {
                ShowDate: { lt: new Date(date) },
                TourId: tourId,
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
        res.status(403).json({ err: "Error occurred while generating results." });
    }

}

