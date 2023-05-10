import {NextApiRequest, NextApiResponse} from "next";
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()


export default async function handle(req, res) {

    try {
        console.log(req.body)
        const closeGap = await prisma.booking.update({
            where:{
                BookingId: req.body.BookingId
            },
            data:{
                VenueId: req.body.VenueId
            }
        })

        res.status(200)
    } catch (e){

    }

}