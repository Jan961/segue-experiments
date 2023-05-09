import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()


export default async function handle(req, res) {


    let query =  "SELECT WeekDate, SUM(GBPValue)  AS GBPTotal, SUM(RunSeatsOSld) AS TotalRunSeatsSold, SUM(TotalSeats) AS TotalTotalSeats," +
        "FROM SalesSummary  " +
        "WHERE Booking Status <> 'X' " +
        "GROUP BY WeekDate " +
        "ORDER BY WeekDate"

    try {
        let result = await prisma.$queryRawUnsafe(`${query}`)
        res.json(result)
    } catch (e){
        res.status(401)
    }
}