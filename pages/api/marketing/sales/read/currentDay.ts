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
    const salesFrequency = req.body.frequency;
    const dateField = salesFrequency === 'W' ? 'SetProductionWeekDate' : 'SetSalesFiguresDate';

    const email = await getEmailFromReq(req);
    const access = await checkAccess(email);
    if (!access) return res.status(401).end();

    const data = await prisma.$queryRaw`select * from SalesView where BookingId = ${bookingId}`;

    const result = data.filter((sale) => removeTime(sale[dateField]).getTime() === removeTime(salesDate).getTime());
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred getting PerformanceLastDates.' });
  }
}
