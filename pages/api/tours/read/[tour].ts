import prisma from 'lib/prisma'

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
