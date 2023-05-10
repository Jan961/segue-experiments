
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

/**
 *
 * note prima has no support for views it is in preview this mst be done via raw
 *
 * SELECT * From WeekView WHERE TourId = 4 ORDER By WeekNum;
 *
 *
 * @param req ShowID
 * @param res
 */
export default async function handle(req, res) {


    let tourId: number = parseInt(req.query.TourId)
    //console.log(tourId)
    const result = await prisma.$queryRaw`SELECT * From WeekView WHERE TourId = ${tourId} ORDER By WeekNum;`
    res.json(result)
}