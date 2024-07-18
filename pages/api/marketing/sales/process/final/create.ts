import prisma from 'lib/prisma';

export default async function handle(req, res) {
  try {
    const { bookingId, salesDate, user, general, schools } = req.body;

    const setResult = await prisma.SalesSet.create({
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

    if (general) {
      sales.push({
        SaleSaleTypeId: 1,
        SaleSeats: general.seatsSold,
        SaleValue: general.seatsSoldVal,
        SaleSetId: setResult.SetId,
      });
    }

    if (Object.values(schools).length > 0) {
      sales.push({
        SaleSaleTypeId: 3,
        SaleSeats: schools.seatsSold,
        SaleValue: schools.seatsSoldVal,
        SaleSetId: setResult.SetId,
      });
    }

    await prisma.Sale.createMany({
      data: sales,
    });

    res.status(200).json({ setId: setResult.SetId });
  } catch (e) {
    console.log(e);
    res.status(401);
  }
}
