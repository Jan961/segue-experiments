

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient()

export default async function handle(req, res) {

    let TourId = parseInt(req.query.TourId)

    let procedure = `SELECT T.TourId, T.FullTourCode, T.ShowName, T.TourStartDate, T.TourEndDate,  SH.TourWeekNum, SH.ShowDate, SH.Town, SH.DescriptionTruncated, SH.BookingStatus, SH.DateTypeName,  V.Currency, C.Symbol, C.ConversionRate, BS.SalesFiguresDate, BS.FinalFigures, BS.SoldSeatsValue AS Value, (BS.SoldSeatsValue * C.ConversionRate) As GBPValue FROM  TourView T INNER JOIN ScheduleView SH ON SH.TourId = T.TourId LEFT OUTER JOIN Venue V ON SH.VenueId = V.VenueId LEFT OUTER JOIN Currency C ON V.Currency = C.Currency LEFT OUTER JOIN BookingSale BS ON SH.BookingId = BS.BookingId AND BS.SalesFiguresDate = (SELECT MAX(BSL.SalesFiguresDate) FROM BookingSale BSL WHERE BSL.BookingId = BS.BookingId AND BSL.SoldSeatsValue > 0)  WHERE T.TourId = ${TourId} AND SH.ShowDate >= T.TourStartDate ORDER BY SH.ShowDate;`

  //  let currency = "SELECT Currency, Symbol, ConversionRate, sum(Value) as Total FROM LocalTourSalesSummary WHERE NOT ((BookingStatus = 'X') OR (Value IS NULL)) GROUP BY Currency, Symbol, ConversionRate ORDER BY Currency"
   // let totals = "SELECT sum(GBPValue) as Total FROM LocalTourSalesSummary WHERE NOT (BookingStatus = 'X')"

    try {
        let result = await prisma.$queryRawUnsafe(`${procedure}`)
        res.json(result)
        res.statusCode(200)
    } catch (e){
        res.statusCode(401)
    }
}