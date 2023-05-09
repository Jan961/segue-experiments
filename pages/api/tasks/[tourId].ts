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
try {
    
    
    let query: number = parseInt(req.query.tourId)
    
    const result = await prisma.tour.findFirst(
        {
            where:{
                TourId: query
            },
            orderBy: {
                TourId: "desc"
            },
            include: {
                Show:true,
                TourTask:{
                    include:{
                        User_TourTask_AssignedByToUser: true,
                        User_TourTask_AssigneeToUser: true,
                    }, 
                    orderBy:{
                        DueDate:"desc"
                    }
                }
              },
        }
        )
        res.json(result)
    } catch (error) {
        res.send(error)
    }
}