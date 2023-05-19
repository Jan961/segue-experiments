import prisma from 'lib/prisma'

export default async function handle(req, res) {

    try {

        const result = await prisma.bookingPromoterHoldAllocation.findMany({
            where: {
                AvailableHoldId: 245
            },
        })
        console.log(JSON.stringify(result))
        res.status(200).json(result)
    } catch (e){
        console.log(e)
        res.status(400)
    }
}
