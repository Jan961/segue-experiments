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
    let salesDate = new Date(req.body.salesDate);
    const salesFrequency = req.body.frequency;
    let dateField = salesFrequency === 'W' ? 'SetProductionWeekDate' : 'SetSalesFiguresDate';

    const email = await getEmailFromReq(req);
    const access = await checkAccess(email);
    if (!access) return res.status(401).end();

    const data =
      await prisma.$queryRaw`select SaleTypeName, Seats, Value, SetSalesFiguresDate, SetProductionWeekDate from SalesView where BookingId = ${bookingId}`;

    // if sale date is null, final sales entry is making the request, set the sales date to the last date entry
    if (req.body.salesDate === null) {
      const sortedData = data.sort(
        (a, b) => new Date(b.SetProductionWeekDate).getTime() - new Date(a.SetProductionWeekDate).getTime(),
      );

      salesDate = new Date(sortedData[0].SetProductionWeekDate);
      dateField = 'SetProductionWeekDate';
    }

    const filtered = data.filter((sale) => removeTime(sale[dateField]).getTime() === removeTime(salesDate).getTime());

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
    };

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred getting current days sales.' });
  }
}
