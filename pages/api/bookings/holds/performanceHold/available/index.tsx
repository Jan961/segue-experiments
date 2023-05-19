import prisma from 'lib/prisma'

export default async function handle(req, res) {

    try {
        const holds = await prisma.bookingPromoterHoldAvailable.findMany({
            where:{
                BookingId: req.body.BookingId
            }
        })

        res.status(200).json(holds)
    } catch (e){
        res.status(400)
    }
}
