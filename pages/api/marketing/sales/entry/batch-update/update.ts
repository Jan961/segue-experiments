import getPrismaClient from 'lib/prisma';

export default async function handle(req, res) {
  try {
    const prisma = await getPrismaClient(req);
    const dbField = req.body.field === 'seats' ? `Set${req.body.type}Seats` : `Set${req.body.type}Value`;

    let data = null;

    if (req.body.type === 'Hold') {
      // get current values across weeks from the entered week
      data = await prisma.$queryRaw`
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
                LEFT OUTER JOIN
                    SetHold
                ON
                    SalesSet.SetId = SetHold.SetHoldSetId
                inner join
                    HoldType on SetHold.SetHoldHoldTypeId = HoldType.HoldTypeId
                WHERE
                    SalesSet.SetBookingId = ${req.body.bookingId}
                    AND SalesSet.SetSalesFiguresDate >= ${req.body.saleDate}
                    AND HoldTypeId = ${req.body.typeId}
                ORDER BY
                    HoldTypeName,SetSalesFiguresDate
            `;

      const comparedValue = data[0][dbField];

      (async () => {
        for (const element of data) {
          if (element[dbField] === comparedValue) {
            await prisma.setHold.update({
              where: { SetHoldId: element.SetHoldId },
              data: {
                [dbField]: parseInt(req.body.value),
              },
            });
          } else {
            break;
          }
        }
      })();
    } else {
      data = await prisma.$queryRaw`
                SELECT
                    SalesSet.SetSalesFiguresDate,
                    CompType.CompTypeId,
                    CompType.CompTypeCode,
                    CompType.HoldTypeName,
                    SetComp.SetCompSeats,
                    SetComp.SetCompId,
                    SalesSet.SetId
                FROM
                    SalesSet
                LEFT OUTER JOIN
                    SetComp
                ON
                    SalesSet.SetId = SetComp.SetCompSetId
                inner join
                    CompType on SetComp.SetCompCompTypeId = CompType.CompTypeId
                WHERE
                    SalesSet.SetBookingId = ${req.body.bookingId}
                    AND SalesSet.SetSalesFiguresDate >= ${req.body.saleDate}
                    AND CompTypeId = ${req.body.typeId}
                ORDER BY
                    CompTypeName, SetSalesFiguresDate
            `;

      const comparedValue = data[0][dbField];

      (async () => {
        for (const element of data) {
          if (element[dbField] === comparedValue) {
            await prisma.setComp.update({
              where: { SetCompId: element.SetCompId },
              data: {
                [dbField]: parseInt(req.body.value),
              },
            });
          } else {
            break;
          }
        }
      })();
    }

    res.status(200).json(data);
  } catch (e) {
    console.error('Error:', e);
    res.status(500).json({ error: e.message });
  }
}
