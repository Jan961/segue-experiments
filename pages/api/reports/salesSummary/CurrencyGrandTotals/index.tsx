import prisma from 'lib/prisma'

export default async function handle(req, res) {


    let query =  "SELECT VenueCurrency, Symbol, ConversionRate, WeekDate, Sum(Value) As Total, Sum RunSeats AS TotalRunSeatsSold, SUM(TotalSeats) AS TotalTotalSeats  " +
        "FROM SalesSummary  " +
        "WHERE Booking Status <> 'X' " +
        "GROUP BY TourWeekNum, VenueCurrency, Symbol, ConversionRate, WeekDate " +
        "ORDER BY TourWeekNum, VenueCurrency, Symbol, ConversionRate, WeekDate"

    try {
        let result = await prisma.$queryRawUnsafe(`${query}`)
        res.json(result)
    } catch (e){
        res.status(401)
    }
}
