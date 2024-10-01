import getPrismaClient from 'lib/prisma';

/**
Parameters = ProductionId & ", "
Parameters = Parameters & IIf(Nz(VenueId, INVALID_ID) > 0, VenueId, "Null") & ", "
Parameters = Parameters & IIf(IsDate(FromDate), "'" & Format(FromDate, "yyyymmdd") & "', ", "Null, ")
Parameters = Parameters & IIf(IsDate(ToDate), "'" & Format(ToDate, "yyyymmdd") & "'", "Null")
*/
export default async function handle(req, res) {
  // console.log(JSON.stringify(req.body))
  const ProductionId = req.body.Production;
  const VenueID = req.body.Venue; // Can be null
  const fromDate = req.body.DateFrom; // Can be null
  const toDate = req.body.DateFrom; // Can be null

  const query = `call GetPromoterHolds(${ProductionId}, ${VenueID},${fromDate},${toDate})`;

  try {
    const prisma = await getPrismaClient(req);
    const result = await prisma.$queryRawUnsafe(`${query}`);
    // console.log(result)
    return res.status(200).json(result);
  } catch (e) {
    // console.log(e)
    res.status(401);
  }
}
