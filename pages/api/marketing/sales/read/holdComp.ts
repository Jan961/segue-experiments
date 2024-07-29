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

    let setId = -1;

    const holdTypes = await prisma.holdType.findMany({
      orderBy: {
        HoldTypeSeqNo: 'asc',
      },
    });

    const compTypes = await prisma.compType.findMany({
      orderBy: {
        CompTypeSeqNo: 'asc',
      },
    });

    // Date without time for comparison
    const salesDateWithoutTime = removeTime(salesDate);

    const rawHoldData = await prisma.salesSet.findMany({
      where: {
        SetBookingId: bookingId,
      },
      select: {
        SetSalesFiguresDate: true,
        SetId: true,
        SetHold: {
          select: {
            SetHoldSeats: true,
            SetHoldValue: true,
            HoldType: {
              select: {
                HoldTypeId: true,
                HoldTypeName: true,
              },
            },
          },
        },
      },
    });

    // Filter the data to include only the dates without time
    const holdData = rawHoldData.reduce((acc, salesSet) => {
      if (removeTime(salesSet.SetSalesFiguresDate).getTime() === salesDateWithoutTime.getTime()) {
        salesSet.SetHold.forEach((setHold) => {
          acc.push({
            SetSalesFiguresDate: salesSet.SetSalesFiguresDate,
            SetId: salesSet.SetId,
            SetHoldSeats: setHold.SetHoldSeats,
            SetHoldValue: setHold.SetHoldValue,
            HoldTypeId: setHold.HoldType.HoldTypeId,
            HoldTypeName: setHold.HoldType.HoldTypeName,
          });
        });
      }
      return acc;
    }, []);

    const rawCompData = await prisma.salesSet.findMany({
      where: {
        SetBookingId: bookingId,
      },
      select: {
        SetSalesFiguresDate: true,
        SetId: true,
        SetComp: {
          select: {
            SetCompSeats: true,
            SetCompId: true,
            CompType: {
              select: {
                CompTypeId: true,
                CompTypeCode: true,
                CompTypeName: true,
              },
            },
          },
        },
      },
    });

    const compData = rawCompData.reduce((acc, salesSet) => {
      if (removeTime(salesSet.SetSalesFiguresDate).getTime() === salesDateWithoutTime.getTime()) {
        const { SetSalesFiguresDate, SetId, SetComp } = salesSet;
        SetComp.forEach((setComp) => {
          const { SetCompSeats, SetCompId, CompType } = setComp;
          const { CompTypeId, CompTypeName } = CompType;
          acc.push({
            SetSalesFiguresDate,
            SetId,
            SetCompSeats,
            SetCompId,
            CompTypeId,
            CompTypeName,
          });
        });
      }
      return acc;
    }, []);

    const holdResult = holdTypes.map((hold) => {
      const holdRecIndex = holdData.findIndex((rec) => rec.HoldTypeId === hold.HoldTypeId);
      if (holdRecIndex === -1) {
        return {
          ...hold,
          SetHoldSeats: 0,
          SetHoldValue: 0,
        };
      } else {
        return {
          ...hold,
          SetHoldSeats: holdData[holdRecIndex].SetHoldSeats,
          SetHoldValue: holdData[holdRecIndex].SetHoldValue,
        };
      }
    });

    const compResult = compTypes.map((comp) => {
      const compRecIndex = compData.findIndex((rec) => rec.CompTypeId === comp.CompTypeId);
      if (compRecIndex === -1) {
        return {
          ...comp,
          SetCompSeats: 0,
        };
      } else {
        return {
          ...comp,
          SetCompSeats: compData[compRecIndex].SetCompSeats,
        };
      }
    });

    if (holdData.length > 0 || compData.length > 0) {
      if ('SetId' in holdData[0]) {
        setId = holdData[0].SetId;
      } else {
        setId = compData[0].SetId;
      }
    }

    const result = {
      holds: holdResult,
      comps: compResult,
      setId,
    };

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred getting hold and comp data.' });
  }
}
