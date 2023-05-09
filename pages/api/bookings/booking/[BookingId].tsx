import {NextApiRequest, NextApiResponse} from "next";
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()


export default async function handle(req, res) {

    try {


        let bookingId = req.query.BookingId

        const searchResults = await prisma.booking.findFirst({
            where: {
                BookingId: parseInt(bookingId),
            },
            include: {
                DateType: true,
                Venue: true,
                Tour: {
                    include: {
                        Show: true,
                    },
                },
            },
        })
        res.json(searchResults)

    } catch (err) {
        console.log(err);
        res.status(403).json({ err: "Error occurred while generating search results." });
    }

}
