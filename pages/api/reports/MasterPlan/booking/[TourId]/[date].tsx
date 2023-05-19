import prisma from 'lib/prisma'

export default async function handle(req, res) {
    let date = new Date(req.query.date)
    try {
        const booking = await prisma.booking.findFirst({
            where: {
                ShowDate: date.toISOString(), //.toISO(req.query.date),
                TourId: parseInt(req.query.TourId)
            },
            include:{
                Venue: true,
                DateType: true
            }
        })

        res.json(booking)

        res.statusCode = 200




    } catch(err) {
        console.log('Generation error; this is the error: ' + err);
    }



}
