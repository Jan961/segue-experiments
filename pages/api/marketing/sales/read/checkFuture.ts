import prisma from 'lib/prisma';

export default async function handle(req, res) {
  try {
    let data = null;
    let result = null;

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
                    AND SalesSet.SetSalesFiguresDate > ${req.body.saleDate}
                    AND HoldTypeId = ${req.body.typeId}
                ORDER BY
                    HoldTypeName,SetSalesFiguresDate
            `;

      result = data
        .sort((a, b) => new Date(a.SetSalesFiguresDate).getTime() - new Date(b.SetSalesFiguresDate).getTime())
        .filter((element, index, array) => index === 0 || element.SetHoldSeats === array[0].SetHoldSeats);
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
                    AND SalesSet.SetSalesFiguresDate > ${req.body.saleDate}
                    AND CompTypeId = ${req.body.typeId}
                ORDER BY
                    CompTypeName, SetSalesFiguresDate
            `;

      result = data
        .sort((a, b) => new Date(a.SetSalesFiguresDate).getTime() - new Date(b.SetSalesFiguresDate).getTime())
        .filter((element, index, array) => index === 0 || element.SetCompSeats === array[0].SetCompSeats);
    }

    res.status(200).json(result);
  } catch (e) {
    console.error('Error:', e);
    res.status(500).json({ error: e.message });
  }
}
