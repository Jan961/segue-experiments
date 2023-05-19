import prisma from 'lib/prisma'

export default async function handle(req, res) {

    let TourId = parseInt(req.query.tourID)
/*
        const result = await prisma.tourWeek.findMany({
            where: {
                TourId: TourId
            },
            include:{
                Tour: true
            },
            orderBy:{
                MondayDate: "desc"
            }
        })
        res.json(result)
    */
    /**
     * WeekView
     *
     * Views are not supported by Prisma at present (preview feature) Raw query is required for now
     */
    let procedure = `SELECT * FROM \`WeekView\` LEFT JOIN Tour  ON WeekView.TourId = Tour.TourId WHERE WeekView.TourId = ${TourId} ORDER BY RawMondayDate Desc`

    try {
        let result = await prisma.$queryRawUnsafe(`${procedure}`)
        res.json(result)
    } catch (e){
        console.log(e)
        res.status(401)
    }


}
