import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()


export default async function handle(req, res) {

    try {
        const hold = await prisma.bookingPromoterHoldAllocation.findMany({
            where: {
                AvailableHoldId: parseInt(req.query.availableHoldId)
            },
        })
        res.status(200).json(hold)
    } catch (e){
        res.status(400)
    }
}