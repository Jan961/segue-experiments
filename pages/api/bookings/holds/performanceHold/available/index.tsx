import {NextApiRequest, NextApiResponse} from "next";
import { PrismaClient } from '@prisma/client'
import {ca} from "date-fns/locale";
const prisma = new PrismaClient()


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