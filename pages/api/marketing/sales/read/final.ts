import prisma from 'lib/prisma';
import { getEmailFromReq, checkAccess } from 'services/userService';

export default async function handle(req, res) {
  try {
    const bookingId = parseInt(req.body.bookingId);

    const email = await getEmailFromReq(req);
    const access = await checkAccess(email);
    if (!access) return res.status(401).end();

    const data = await prisma.$queryRaw`select 
                                SaleTypeName,
                                Seats, 
                                Value, 
                                SetSalesFiguresDate, 
                                SetProductionWeekDate, 
                                SetIsFinalFigures,
                                SetFinalSalesApprovedByUser
                            from SalesView
                            where BookingId = ${bookingId}
                            AND SetIsFinalFigures = TRUE `;

    if (data.length > 0) {
      const schoolSales = data.find((sale) => sale.SaleTypeName === 'School Sales');
      const generalSales = data.find((sale) => sale.SaleTypeName === 'General Sales');

      let result = {
        schools: {
          seatsSold: schoolSales?.Seats === undefined ? '' : schoolSales.Seats,
          seatsSoldVal: schoolSales?.Value === undefined ? '' : schoolSales.Value,
        },
        general: {
          seatsSold: generalSales?.Seats === undefined ? '' : generalSales.Seats,
          seatsSoldVal: generalSales?.Value === undefined ? '' : generalSales.Value,
        },
        user: null,
      };

      if ('SetFinalSalesApprovedByUser' in generalSales) {
        result = { ...result, user: generalSales.SetFinalSalesApprovedByUser };
      } else if ('SetFinalSalesApprovedByUser' in schoolSales) {
        result = { ...result, user: schoolSales.SetFinalSalesApprovedByUser };
      }

      res.status(200).json(result);
    } else {
      res.status(200).json({});
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred getting current days sales.' });
  }
}
