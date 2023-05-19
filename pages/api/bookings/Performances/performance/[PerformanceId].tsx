import { loggingService } from 'services/loggingService'
import prisma from 'lib/prisma'

export default async function handle(req, res) {

    try {

        const searchResults = await prisma.bookingPerformance.findFirst({

            where: {
                PerformanceId:  parseInt(req.query.PerformanceId)
            },
        })

        res.status(200).json(searchResults)

    } catch (err) {
        await loggingService.logError("Performance Issue" + err)
        res.status(403).json({ err: "Error occurred while generating search results." + err});
    }

}
