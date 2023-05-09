
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


    let query: number = parseInt(req.query.tour)

    const result = await prisma.tour.findMany(
        {
            where:{
                ShowId:   query,
                Deleted: false
            },
            include: {
                Show: true,
            },
            orderBy: {
                TourStartDate: "desc"
            }
        }
    )
    res.json(result)
}