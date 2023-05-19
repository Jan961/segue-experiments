import prisma from 'lib/prisma'

export default async function handle(req, res) {

    console.log(JSON.stringify(req.body))
    try {
        const  createHolds = await prisma.bookingPromoterHoldAllocation.delete({
            where:{
                HoldAllocationId: parseInt(req.body.HoldAllocationId)
            },
        })
        res.status(200).json(createHolds)
    } catch (e){

        loggingService.logError(e)
            .then(
                res.status(400)
            )

    }
}
