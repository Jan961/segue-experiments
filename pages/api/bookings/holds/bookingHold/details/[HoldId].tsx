import prisma from 'lib/prisma'

export default async function handle(req, res) {

    try {
        const hold = await prisma.bookingPromoterHoldAllocation.findFirst({
            where: {
                HoldAllocationId: parseInt(req.query.HoldId)
            },
        })
        res.status(200).json(hold)
    } catch (e){
        res.status(400)
    }
}
