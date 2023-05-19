import prisma from 'lib/prisma'

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
