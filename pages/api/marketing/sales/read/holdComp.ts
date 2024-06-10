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

    const holdData = await prisma.$queryRaw`
        SELECT 
            SalesSet.SetSalesFiguresDate, 
            HoldType.HoldTypeId, 
            HoldType.HoldTypeCode, 
            HoldType.HoldTypeName, 
            SetHold.SetHoldSeats, 
            SetHold.SetHoldValue 
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
            SetComp.SetCompSeats
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
        return { name: hold.HoldTypeName, seats: 0, value: 0 };
      });
      // else map the db fields to nicer field names to be handled in the UI
    } else {
      holdDataResult = filteredHolds.map((hold) => {
        return { name: hold.HoldTypeName, seats: hold.SetHoldSeats, value: hold.SetHoldValue };
      });
    }

    // if filteredComps is [], populate with the comp types
    if (filteredHolds.length === 0) {
      const compTypes = await prisma.$queryRaw`select * from CompType order by CompTypeSeqNo`;
      compDataResult = compTypes.map((comp) => {
        return { name: comp.CompTypeName, seats: 0 };
      });
      // else map the db fields to nicer field names to be handled in the UI
    } else {
      compDataResult = filteredComps.map((comp) => {
        return { name: comp.CompTypeName, seats: comp.SetCompSeats };
      });
    }

    const result = {
      holds: holdDataResult,
      comps: compDataResult,
    };

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred getting hold and comp data.' });
  }
}
