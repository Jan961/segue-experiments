import prisma from 'lib/prisma'
import { dateService } from 'services/dateService'

export default async function handle(req, res) {
    const TourId =  parseInt(req.query.TourId)
    // Convert Show Date ito datetime
    const ShowDate = new Date(dateService.dateToSimple(res.query.date + " 00:00:00"))


    try {
        const searchResults = await prisma.booking.findFirst({
            where: {
                ShowDate: ShowDate,
                TourId: TourId,
            },
          })

        res.json(searchResults)


    } catch (err) {
        console.log(err);
        res.status(403).json({ err: "Error occurred while generating search results." });
    }
}
