import prisma from 'lib/prisma'

export default async function handle(req, res) {

    let tourID = parseInt(req.query.tourId)
    let query = `SELECT DISTINCT WeekName, WeekDate, WeekCode FROM SalesSummaryView WHERE TourId = ${tourID}  ORDER BY  WeekDate`

    try {
        let result = await prisma.$queryRawUnsafe(`${query}`)
        res.json(result)
    } catch (e){
        res.status(401)
    }
}
