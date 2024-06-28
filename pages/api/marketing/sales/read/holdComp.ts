import prisma from 'lib/prisma';
import { getEmailFromReq, checkAccess } from 'services/userService';

export type LastPerfDate = {
  BookingId: number;
  LastPerformanaceDate: string;
};

// date-fns startOfDay not applicable for this use case
const removeTime = (inputDate: Date) => {
  const date = new Date(inputDate);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
};

export default async function handle(req, res) {
  try {
    const bookingId = parseInt(req.body.bookingId);
    const salesDate = new Date(req.body.salesDate);

    const email = await getEmailFromReq(req);
    const access = await checkAccess(email);
    if (!access) return res.status(401).end();

    let holdDataResult = [];
    let compDataResult = [];
    let setId = -1;

    const holdData = await prisma.$queryRaw`
        SELECT 
            SalesSet.SetSalesFiguresDate, 
            HoldType.HoldTypeId, 
            HoldType.HoldTypeCode, 
            HoldType.HoldTypeName, 
            SetHold.SetHoldSeats, 
            SetHold.SetHoldValue,
            SetHold.SetHoldId,
            SalesSet.SetId
        FROM 
            SalesSet
        CROSS JOIN 
            HoldType
        LEFT OUTER JOIN 
            SetHold 
        ON 
            HoldType.HoldTypeId = SetHold.SetHoldHoldTypeId 
            AND SalesSet.SetId = SetHold.SetHoldSetId
        WHERE 
            SalesSet.SetBookingId = ${bookingId}
        ORDER BY 
            HoldTypeSeqNo
    `;

    const compData = await prisma.$queryRaw`
        SELECT
            SalesSet.SetSalesFiguresDate,
            CompType.CompTypeId,
            CompType.CompTypeCode,
            CompType.CompTypeName,
            SetComp.SetCompSeats,
            SetComp.SetCompId,
            SalesSet.SetId
        FROM
            SalesSet
        CROSS JOIN
            CompType
        LEFT OUTER JOIN
            SetComp
        ON
            CompType.CompTypeId = SetComp.SetCompCompTypeId
            AND SalesSet.SetId = SetComp.SetCompSetId
        WHERE
            SalesSet.SetBookingId = ${bookingId}
        ORDER BY
            CompTypeSeqNo
    `;

    const filteredHolds = holdData.filter(
      (sale) => removeTime(sale.SetSalesFiguresDate).getTime() === removeTime(salesDate).getTime(),
    );

    const filteredComps = compData.filter(
      (sale) => removeTime(sale.SetSalesFiguresDate).getTime() === removeTime(salesDate).getTime(),
    );

    // if filteredHolds is [], populate with the hold types
    if (filteredHolds.length === 0) {
      const holdTypes = await prisma.$queryRaw`select * from HoldType order by HoldTypeSeqNo`;
      holdDataResult = holdTypes.map((hold) => {
        return { name: hold.HoldTypeName, seats: 0, value: 0, id: hold.HoldTypeId, recId: null };
      });
      // else map the db fields to nicer field names to be handled in the UI
    } else {
      holdDataResult = filteredHolds.map((hold) => {
        return {
          name: hold.HoldTypeName,
          seats: hold.SetHoldSeats,
          value: hold.SetHoldValue,
          id: hold.HoldTypeId,
          recId: hold.SetHoldId,
        };
      });
    }

    // if filteredComps is [], populate with the comp types
    if (filteredHolds.length === 0) {
      const compTypes = await prisma.$queryRaw`select * from CompType order by CompTypeSeqNo`;
      compDataResult = compTypes.map((comp) => {
        return { name: comp.CompTypeName, seats: 0, id: comp.CompTypeId, recId: null };
      });
      // else map the db fields to nicer field names to be handled in the UI
    } else {
      compDataResult = filteredComps.map((comp) => {
        return { name: comp.CompTypeName, seats: comp.SetCompSeats, id: comp.CompTypeId, recId: comp.SetCompId };
      });
    }

    if (filteredHolds.length > 0 || filteredComps.length > 0) {
      if ('SetId' in filteredHolds[0]) {
        setId = filteredHolds[0].SetId;
      } else {
        setId = filteredComps[0].SetId;
      }
    }

    const result = {
      holds: holdDataResult,
      comps: compDataResult,
      setId,
    };

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred getting hold and comp data.' });
  }
}
