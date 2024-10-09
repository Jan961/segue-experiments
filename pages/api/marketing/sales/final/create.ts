import getPrismaClient from 'lib/prisma';
import { isNullOrEmpty } from 'utils';

export default async function handle(req, res) {
  try {
    const prisma = await getPrismaClient(req);
    const { bookingId, salesDate, user, general, schools } = req.body;

    const setResult = await prisma.salesSet.create({
      data: {
        SetBookingId: parseInt(bookingId),
        SetPerformanceId: null,
        SetSalesFiguresDate: salesDate,
        SetBrochureReleased: false,
        SetSingleSeats: false,
        SetNotOnSale: false,
        SetIsFinalFigures: true,
        SetIsCopy: false,
        SetFinalSalesApprovedByUser: user,
      },
    });

    const sales = [];

    if (!isNullOrEmpty(general)) {
      sales.push({
        SaleSaleTypeId: 1,
        SaleSeats: general.seatsSold,
        SaleValue: general.seatsSoldVal,
        SaleSetId: setResult.SetId,
      });
    }

    if (!isNullOrEmpty(schools)) {
      sales.push({
        SaleSaleTypeId: 3,
        SaleSeats: schools.seatsSold,
        SaleValue: schools.seatsSoldVal,
        SaleSetId: setResult.SetId,
      });
    }

    await prisma.sale.createMany({
      data: sales,
    });

    res.status(200).json({ setId: setResult.SetId });
  } catch (e) {
    console.log(e);
    res.status(401);
  }
}
