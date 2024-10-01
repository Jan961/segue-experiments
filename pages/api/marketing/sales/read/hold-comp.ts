import getPrismaClient from 'lib/prisma';
import { isNullOrEmpty } from 'utils';

interface Hold {
  name: string;
  seats: number;
  value: number;
  id: number;
}

interface Comp {
  name: string;
  seats: number;
  id: number;
}

export type Res = {
  holds: Array<Hold>;
  comps: Array<Comp>;
  setId: number;
};

let prisma = null;

const getCompHoldData = async (bookingId) => {
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

  const holdCompData = await prisma.salesSet.findMany({
    where: {
      SetBookingId: bookingId,
      // SetHold or SetHold are not null
      OR: [
        {
          SetHold: {
            some: {},
          },
        },
        {
          SetComp: {
            some: {},
          },
        },
      ],
    },
    // get the last sales entry from the user
    orderBy: {
      SetSalesFiguresDate: 'desc',
    },
    // select both SetComp and SetHold data as data should be stored against the same SetId
    select: {
      SetSalesFiguresDate: true,
      SetId: true,
      SetHold: {
        select: {
          SetHoldSeats: true,
          SetHoldValue: true,
          SetHoldId: true,
          SetHoldSetId: true,
          HoldType: {
            select: {
              HoldTypeId: true,
              HoldTypeName: true,
            },
          },
        },
      },
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
    take: 1,
  });

  const holdDataObj = holdCompData.length > 0 ? holdCompData[0] : null;
  const holdResult = holdTypes.map((hold) => {
    const holdRecIndex = holdDataObj?.SetHold.findIndex((rec) => rec.HoldType?.HoldTypeId === hold.HoldTypeId);
    if (holdRecIndex === -1 || isNullOrEmpty(holdDataObj)) {
      return {
        name: hold.HoldTypeName,
        seats: 0,
        value: 0,
        id: hold.HoldTypeId,
      };
    } else {
      return {
        name: hold.HoldTypeName,
        seats: holdDataObj.SetHold[holdRecIndex].SetHoldSeats,
        value: holdDataObj.SetHold[holdRecIndex].SetHoldValue,
        id: hold.HoldTypeId,
      };
    }
  });

  const compResult = compTypes.map((comp) => {
    const compRecIndex = holdDataObj?.SetComp.findIndex((rec) => rec.CompType?.CompTypeId === comp.CompTypeId);
    if (compRecIndex === -1 || isNullOrEmpty(holdDataObj)) {
      return {
        name: comp.CompTypeName,
        seats: 0,
        id: comp.CompTypeId,
      };
    } else {
      return {
        name: comp.CompTypeName,
        seats: holdDataObj.SetComp[compRecIndex].SetCompSeats,
        id: comp.CompTypeId,
      };
    }
  });

  return {
    holds: holdResult,
    comps: compResult,
    setId: holdCompData.length > 0 ? holdCompData[0].SetId : -1,
  };
};

export default async function handle(req, res) {
  try {
    const salesDate = new Date(req.body.salesDate);
    prisma = await getPrismaClient(req);
    const result = await getCompHoldData(salesDate);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred getting hold and comp data.' });
  }
}
