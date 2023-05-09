import {NextApiRequest, NextApiResponse} from "next";
import { PrismaClient } from '@prisma/client'
import {ca} from "date-fns/locale";
import {Prisma} from "@prisma/client/scripts/default-index";
const prisma = new PrismaClient()


export default async function handle(req, res) {

    try {

        //console.log("body" + JSON.stringify(req.body))
        const perfId = 344 //req.body.perfomanceId
        const result = await prisma.$queryRaw`Select * FROM BookingPromoterHoldAllocation 
                                            LEFT JOIN BookingPromoterHoldAvailable 
                                                ON BookingPromoterHoldAllocation.AvailableHoldId 
                                                       = BookingPromoterHoldAvailable.AvailableHoldId 
                                            WHERE BookingPromoterHoldAvailable.BookingId = ${perfId}`

        console.log(JSON.stringify(result))
        res.status(200).json(result)


    } catch (e){
        console.log(e)
        res.status(400)
    }
}