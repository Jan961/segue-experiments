import { UTCDate } from '@date-fns/utc';
import getPrismaClient from 'lib/prisma';
import { getKey, newDate } from 'services/dateService';

export default async function handle(req, res) {
  try {
    const prisma = await getPrismaClient(req);
    const bookingId = parseInt(req.body.bookingId);
    let salesDate = newDate(req.body.salesDate);

    const salesFrequency = req.body.frequency;
    let dateField = salesFrequency === 'W' ? 'SetProductionWeekDate' : 'SetSalesFiguresDate';

    const data = await prisma.salesView
      .findMany({
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
      })
      .then((res) =>
        res.map((x) => ({
          ...x,
          SetProductionWeekDate: new UTCDate(x.SetProductionWeekDate),
        })),
      );

    if (data.length === 0) {
      res.status(200).json({});
      return;
    }

    // if sale date is null, final sales entry is making the request, set the sales date to the last date entry
    if (req.body.salesDate === null) {
      const sortedData = data.sort((a, b) => b.SetProductionWeekDate.getTime() - a.SetProductionWeekDate.getTime());

      salesDate = sortedData[0].SetProductionWeekDate;
      dateField = 'SetProductionWeekDate';
    }

    const filtered = data.filter(
      (sale) => newDate(getKey(sale[dateField])).getTime() === newDate(getKey(salesDate)).getTime(),
    );

    if (filtered.length > 0) {
      const schoolReservations = filtered.find((sale) => sale.SaleTypeName === 'School Reservations');
      const schoolSales = filtered.find((sale) => sale.SaleTypeName === 'School Sales');
      const generalReservations = filtered.find((sale) => sale.SaleTypeName === 'General Reservations');
      const generalSales = filtered.find((sale) => sale.SaleTypeName === 'General Sales');

      const result = {
        schools: {
          seatsSold: schoolSales?.Seats === undefined ? '' : schoolSales.Seats,
          seatsSoldVal: schoolSales?.Value === undefined ? '' : schoolSales.Value,
          seatsReserved: schoolReservations?.Seats === undefined ? '' : schoolReservations.Seats,
          seatsReservedVal: schoolReservations?.Value === undefined ? '' : schoolReservations.Value,
        },
        general: {
          seatsSold: generalSales?.Seats === undefined ? '' : generalSales.Seats,
          seatsSoldVal: generalSales?.Value === undefined ? '' : generalSales.Value,
          seatsReserved: generalReservations?.Seats === undefined ? '' : generalReservations.Seats,
          seatsReservedVal: generalReservations?.Value === undefined ? '' : generalReservations.Value,
        },
        setId: generalSales?.SetId,
      };

      res.status(200).json(result);
    } else {
      res.status(200).json({});
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred getting current days sales.' });
  }
}
