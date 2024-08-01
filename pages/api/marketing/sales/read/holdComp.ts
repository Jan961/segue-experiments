import prisma from 'lib/prisma';
import { addDurationToDate, getMonday } from 'services/dateService';
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

const getCompHoldData = async (salesDate, bookingId) => {
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
    },
  });

  // Filter the data to include only the dates without time
  const holdData = rawHoldData.reduce((acc, salesSet) => {
    const inputWeek = getMonday(salesSet.SetSalesFiguresDate);
    const selectedWeek = getMonday(salesDate);

    if (removeTime(inputWeek).getTime() === removeTime(selectedWeek).getTime()) {
      salesSet.SetHold.forEach((setHold) => {
        acc.push({
          seats: setHold.SetHoldSeats,
          value: setHold.SetHoldValue,
          id: setHold.HoldType.HoldTypeId,
          name: setHold.HoldType.HoldTypeName,
          recId: setHold.SetHoldId,
          setId: setHold.SetHoldSetId,
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
    const inputWeek = getMonday(salesSet.SetSalesFiguresDate);
    const selectedWeek = getMonday(salesDate);

    if (removeTime(inputWeek).getTime() === removeTime(selectedWeek).getTime()) {
      const { SetId, SetComp } = salesSet;
      SetComp.forEach((setComp) => {
        const { SetCompSeats, SetCompId, CompType } = setComp;
        const { CompTypeId, CompTypeName } = CompType;
        acc.push({
          seats: SetCompSeats,
          id: CompTypeId,
          name: CompTypeName,
          recId: SetCompId,
          setId: SetId,
        });
      });
    }
    return acc;
  }, []);

  const holdResult = holdTypes.map((hold) => {
    const holdRecIndex = holdData.findIndex((rec) => rec.id === hold.HoldTypeId);
    if (holdRecIndex === -1) {
      return {
        name: hold.HoldTypeName,
        seats: 0,
        value: 0,
        id: hold.HoldTypeId,
      };
    } else {
      return {
        ...holdData[holdRecIndex],
      };
    }
  });

  const compResult = compTypes.map((comp) => {
    const compRecIndex = compData.findIndex((rec) => rec.id === comp.CompTypeId);
    if (compRecIndex === -1) {
      return {
        name: comp.CompTypeName,
        seats: 0,
        id: comp.CompTypeId,
      };
    } else {
      return {
        ...compData[compRecIndex],
      };
    }
  });

  let setId = -1;
  if (holdData.length > 0 || compData.length > 0) {
    if ('setId' in holdData[0]) {
      setId = holdData[0].setId;
    } else {
      setId = compData[0].setId;
    }
  }

  return {
    holds: holdResult,
    comps: compResult,
    setId,
  };
};

const isDataAvailable = (data) => {
  const hSeatsCheck = data.holds.every((item) => item.seats === 0);
  const hValueCheck = data.holds.every((item) => item.value === 0);
  const cSeatsCheck = data.comps.every((item) => item.seats === 0);

  const checksArray = [hSeatsCheck, hValueCheck, cSeatsCheck];

  return !checksArray.every((item) => item === true);
};

const copyData = (data, datesTried, bookingId) => {
  datesTried.forEach(async (dtIn) => {
    // create a SalesSet and get a setID for this week that has no data
    const setResult = await prisma.SalesSet.create({
      data: {
        SetBookingId: parseInt(bookingId),
        SetPerformanceId: null,
        SetSalesFiguresDate: dtIn,
        SetBrochureReleased: false,
        SetSingleSeats: false,
        SetNotOnSale: false,
        SetIsFinalFigures: false,
        SetIsCopy: false,
      },
    });

    const dbUpdates = [];

    // hold data first
    data.holds.forEach((holdRec) => {
      if (holdRec.seats > 0 || holdRec.value > 0) {
        dbUpdates.push(
          prisma.setHold.create({
            data: {
              SetHoldSetId: setResult.SetId,
              SetHoldHoldTypeId: holdRec.id,
              SetHoldSeats: parseInt(holdRec.seats),
              SetHoldValue: parseFloat(holdRec.value),
            },
          }),
        );
      }
    });

    // comp data
    data.comps.forEach((compRec) => {
      if (compRec.seats > 0) {
        dbUpdates.push(
          prisma.setComp.create({
            data: {
              SetCompSetId: setResult.SetId,
              SetCompCompTypeId: compRec.id,
              SetCompSeats: parseInt(compRec.seats),
            },
          }),
        );
      }
    });

    await prisma.$transaction(dbUpdates);
  });
};

export default async function handle(req, res) {
  try {
    const bookingId = parseInt(req.body.bookingId);
    const salesDate = new Date(req.body.salesDate);
    const ProductionId = req.body.productionId;

    const email = await getEmailFromReq(req);
    const access = await checkAccess(email);
    if (!access) return res.status(401).end();

    let result = {};

    const { SalesFrequency } = await prisma.production.findUnique({
      where: {
        Id: ProductionId,
      },
      select: {
        SalesFrequency: true,
      },
    });

    // loop through previous sales until we find a set that exists
    let currentDate = salesDate;
    const triedDates = [];

    do {
      result = await getCompHoldData(currentDate, bookingId);

      if (!isDataAvailable(result)) {
        triedDates.push(currentDate);
        currentDate = addDurationToDate(currentDate, SalesFrequency === 'W' ? 7 : 1, false);
      }
    } while (!isDataAvailable(result));

    // if tried dates is greater than 0, we need to copy the new found data into the weeks that were missed
    if (triedDates.length > 0) {
      copyData(result, triedDates, bookingId);
    }

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred getting hold and comp data.' });
  }
}
