import {NextApiRequest, NextApiResponse} from "next";
import { PrismaClient } from '@prisma/client'
import {ca} from "date-fns/locale";
import {loggingService} from "../../../../../../services/loggingService";
const prisma = new PrismaClient()


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