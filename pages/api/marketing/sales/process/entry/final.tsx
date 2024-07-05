import prisma from 'lib/prisma';

export default async function handle(req, res) {
  try {
    const setResult = await prisma.SalesSet.create({
      data: {
        SetBookingId: parseInt(req.body.bookingId),
        SetPerformanceId: null,
        SetSalesFiguresDate: req.body.salesDate,
        SetBrochureReleased: false,
        SetSingleSeats: false,
        SetNotOnSale: false,
        SetIsFinalFigures: true,
        SetIsCopy: false,
        SetFinalSalesApprovedByUser: req.body.user,
      },
    });

    const sales = [];

    if (req.body.general) {
      sales.push({
        SaleSaleTypeId: 1,
        SaleSeats: req.body.general.seatsSold,
        SaleValue: req.body.general.seatsSoldVal,
        SaleSetId: setResult.SetId,
      });
    }

    if (Object.values(req.body.schools).length !== 0) {
      sales.push({
        SaleSaleTypeId: 3,
        SaleSeats: req.body.schools.seatsSold,
        SaleValue: req.body.schools.seatsSoldVal,
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
