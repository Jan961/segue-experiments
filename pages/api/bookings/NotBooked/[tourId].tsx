import prisma from 'lib/prisma'

export default async function handle(req, res) {

    try {


        let TourID = req.query.tourId

        const searchResults = await prisma.booking.findMany({
            where: {
                TourId: parseInt(TourID),
                AND: [
                    {
                        DayTypeCrew: 1, //null
                        DayTypeCast: 1,  //null
                        VenueId: null
                    },
                ],
            },
            select: {
                BookingId: true,
                ShowDate: true
            }
        })
        res.json(searchResults)

    } catch (err) {
        console.log(err);
        res.status(403).json({ err: "Error occurred while generating search results." });
    }

}
