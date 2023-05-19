import prisma from 'lib/prisma'

export default async function handle(req, res) {

    try {


        let bookingId = req.query.BookingId

        const result = await prisma.booking.findFirst({
            where: {
                BookingId: parseInt(bookingId),
            },
            include: {
                DateType: true,
                Venue: true,
                Tour: {
                    include: {
                        Show: true,
                    },
                },
            },
        })
        res.json(result)

        JSON.stringify(result)
    } catch (err) {
        console.log(err);
        res.status(403).json({ err: "Error occurred while generating search results." });
    }

}
