import getPrismaClient from 'lib/prisma';

export default async function handle(req, res) {
  const ProductionId = parseInt(req.query.ProductionId);

  const procedure = `SELECT T.ProductionId, T.FullProductionCode, T.ShowName, T.ProductionStartDate, T.ProductionEndDate,  SH.ProductionWeekNum, SH.ShowDate, SH.Town, SH.DescriptionTruncated, SH.BookingStatus, SH.DateTypeName,  V.Currency, C.Symbol, C.ConversionRate, BS.SalesFiguresDate, BS.FinalFigures, BS.SoldSeatsValue AS Value, (BS.SoldSeatsValue * C.ConversionRate) As GBPValue FROM  ProductionView T INNER JOIN ScheduleView SH ON SH.ProductionId = T.ProductionId LEFT OUTER JOIN Venue V ON SH.VenueId = V.VenueId LEFT OUTER JOIN Currency C ON V.Currency = C.Currency LEFT OUTER JOIN BookingSale BS ON SH.BookingId = BS.BookingId AND BS.SalesFiguresDate = (SELECT MAX(BSL.SalesFiguresDate) FROM BookingSale BSL WHERE BSL.BookingId = BS.BookingId AND BSL.SoldSeatsValue > 0)  WHERE T.ProductionId = ${ProductionId} AND SH.ShowDate >= T.ProductionStartDate ORDER BY SH.ShowDate;`;

  //  let currency = "SELECT Currency, Symbol, ConversionRate, sum(Value) as Total FROM LocalProductionSalesSummary WHERE NOT ((BookingStatus = 'X') OR (Value IS NULL)) GROUP BY Currency, Symbol, ConversionRate ORDER BY Currency"
  // let totals = "SELECT sum(GBPValue) as Total FROM LocalProductionSalesSummary WHERE NOT (BookingStatus = 'X')"

  try {
    const prisma = await getPrismaClient(req);
    const result = await prisma.$queryRawUnsafe(`${procedure}`);
    res.json(result);
    res.statusCode(200);
  } catch (e) {
    res.statusCode(401);
  }
}
