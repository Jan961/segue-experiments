import {NextApiRequest, NextApiResponse} from "next";
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()


export default async function handle(req, res) {

    try {
        let bookingId = parseInt(req.query.bookingId)
        // let showID = req.query.showID
        const searchResults = await prisma.contract.findMany({
            where: {
                BookingId: bookingId,
            },
            include:{
                Booking:{
                    include:{
                        Venue:true
                    }
                }
            }
        })
       await res.json(searchResults)
        // await res.json({"string": "hello"})

    } catch (err) {
        console.log(err);
        res.status(403).json({ err: "Error occurred while generating search results." });
    }

}


