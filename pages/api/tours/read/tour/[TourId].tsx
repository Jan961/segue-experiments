
import prisma from 'lib/prisma'

export default async function handle(req, res) {


    let query = parseInt(req.query.TourId)
    //console.log(query)
    const result = await prisma.tour.findFirst(
        {
            where:{
                TourId:   query,
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
