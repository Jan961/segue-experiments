
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

/**
 *
 * Default query using Prisma to provide ORM
 *
 *
 * @param req ShowID
 * @param res
 */
export default async function handle(req, res) {


    let TourCode = req.query.TourCode
    let ShowCode = req.query.ShowCode
    try {
        const result = await prisma.tour.findFirst(
            {
                where: {
                    Code: TourCode,
                    Show: {
                        Code: ShowCode
                    }
                },
                include: {
                    Show: true,
                }
            }
        )
        res.json(result)
    } catch (e){
        console.log(e)
    }
}