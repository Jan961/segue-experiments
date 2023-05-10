
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()


export default  async function handle(req, res) {

    //console.log(req)
    const updateValidation = await prisma.accountSalesDataValidaton.upsert({
        where: {
            AccountId: parseInt(req.data.accountId),
        },
        update: {
            lowSeatCount: parseInt(req.data.lowSeatCount),
            seatPercentageIncrease: parseInt(req.data.seatPercentageIncrease),
            HighSeatCount: parseInt(req.data.HighSeatCount),
            seatPercentageLowerIncrease: parseInt(req.data.seatPercentageLowerIncrease),
            reservedSeatPercentageIncrease: parseInt(req.data.reservedSeatPercentageIncrease),
        },
        create: {
            AccountId: req.data.accountId,
            lowSeatCount: parseInt(req.data.lowSeatCount),
            seatPercentageIncrease: parseInt(req.data.seatPercentageIncrease),
            HighSeatCount: parseInt(req.data.HighSeatCount),
            seatPercentageLowerIncrease: parseInt(req.data.seatPercentageLowerIncrease),
            reservedSeatPercentageIncrease: parseInt(req.data.reservedSeatPercentageIncrease),
        },
    })

}