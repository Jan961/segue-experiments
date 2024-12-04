import getPrismaClient from 'lib/prisma';
import { PrismaClient } from 'prisma/generated/prisma-client';
import { compareDatesWithoutTime, getDateDaysAway, getMonday } from 'services/dateService';
import { formatDecimalValue, isNullOrUndefined, isUndefined } from 'utils';

const generateSalesObject = (sales) => {
  const schoolReservations = sales.find((sale) => sale.SaleTypeName === 'School Reservations');
  const schoolSales = sales.find((sale) => sale.SaleTypeName === 'School Sales');
  const generalReservations = sales.find((sale) => sale.SaleTypeName === 'General Reservations');
  const generalSales = sales.find((sale) => sale.SaleTypeName === 'General Sales');

  return sales.length > 0
    ? {
        schools: {
          seatsSold: isNullOrUndefined(schoolSales?.Seats) ? '' : schoolSales.Seats,
          seatsSoldVal: isNullOrUndefined(schoolSales?.Value) ? '' : formatDecimalValue(schoolSales.Value),
          seatsReserved: isNullOrUndefined(schoolReservations?.Seats) ? '' : schoolReservations.Seats,
          seatsReservedVal: isNullOrUndefined(schoolReservations?.Value)
            ? ''
            : formatDecimalValue(schoolReservations.Value),
        },
        general: {
          seatsSold: isNullOrUndefined(generalSales?.Seats) ? '' : generalSales.Seats,
          seatsSoldVal: isNullOrUndefined(generalSales?.Value) ? '' : formatDecimalValue(generalSales.Value),
          seatsReserved: isNullOrUndefined(generalReservations?.Seats) ? '' : generalReservations.Seats,
          seatsReservedVal: isNullOrUndefined(generalReservations?.Value)
            ? ''
            : formatDecimalValue(generalReservations.Value),
        },
        setId: generalSales?.SetId,
        setSaleFiguresDate: generalSales?.SetSalesFiguresDate,
      }
    : {};
};

const getSalesFrequency = async (prisma: PrismaClient, productionId: number) => {
  const production = await prisma.production.findUnique({
    where: {
      Id: productionId,
    },
    select: {
      SalesFrequency: true,
    },
  });

  return production.SalesFrequency;
};

export default async function handle(req, res) {
  try {
    const prisma = await getPrismaClient(req);
    const bookingId = parseInt(req.body.bookingId);
    const productionId = req.body.productionId;

    // control whether the previous sales are returned or not
    // the value can be undefined if not supplied
    const prevRequired = isUndefined(req.body.prevRequired) ? false : Boolean(req.body.prevRequired);

    const salesFrequency = await getSalesFrequency(prisma, productionId);
    let dateField = salesFrequency === 'W' ? 'SetProductionWeekDate' : 'SetSalesFiguresDate';
    const salesEntryDuration = salesFrequency === 'W' ? 7 : 1;
    let currentSalesDate = salesFrequency === 'W' ? getMonday(req.body.salesDate) : req.body.salesDate;

    const data = await prisma.salesView.findMany({
      where: {
        BookingId: bookingId,
        SaleTypeName: {
          not: '',
        },
      },
      select: {
        SaleTypeName: true,
        Seats: true,
        Value: true,
        SetSalesFiguresDate: true,
        SetProductionWeekDate: true,
        SetId: true,
      },
    });

    if (data.length === 0) {
      res.status(200).json({});
      return;
    }

    // if sale date is null, final sales entry is making the request, set the sales date to the last date entry
    if (req.body.salesDate === null) {
      const sortedData = data.sort(
        (a, b) => new Date(b.SetProductionWeekDate).getTime() - new Date(a.SetProductionWeekDate).getTime(),
      );

      currentSalesDate = new Date(sortedData[0].SetProductionWeekDate);
      dateField = 'SetProductionWeekDate';
    }

    const currentSales = data.filter((sale) =>
      compareDatesWithoutTime(sale[dateField], currentSalesDate.getTime(), '=='),
    );

    let result = {
      current: !isNullOrUndefined(currentSales) ? generateSalesObject(currentSales) : null,
      previous: null,
    };

    // if previous sales are required, filter the data and append to the result
    if (prevRequired) {
      const previousSalesDate = getDateDaysAway(currentSalesDate.getTime(), -salesEntryDuration);
      const previousSales = data.filter((sale) =>
        compareDatesWithoutTime(sale[dateField], previousSalesDate.getTime(), '=='),
      );
      result = { ...result, previous: !isNullOrUndefined(previousSales) ? generateSalesObject(previousSales) : null };
    }

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred getting current/previous days sales.' });
  }
}
