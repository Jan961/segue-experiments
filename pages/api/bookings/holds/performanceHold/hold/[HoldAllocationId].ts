import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()


export default async function handle(req, res) {

    try {
        const hold = await prisma.bookingPromoterHoldAllocation.findFirst({
            where: {
                HoldAllocationId: parseInt(req.query.HoldAllocationId)
            },
        })
        res.status(200).json(hold)
    } catch (e){
        res.status(400)
    }
}