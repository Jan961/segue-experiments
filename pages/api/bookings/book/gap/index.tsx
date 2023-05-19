import prisma from 'lib/prisma'

export default async function handle(req, res) {

    try {
        console.log(req.body)
        const closeGap = await prisma.booking.update({
            where:{
                BookingId: req.body.BookingId
            },
            data:{
                VenueId: req.body.VenueId
            }
        })

        res.status(200)
    } catch (e){

    }

}
