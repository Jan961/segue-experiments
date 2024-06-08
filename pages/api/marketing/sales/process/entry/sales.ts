import prisma from 'lib/prisma';

export default async function handle(req, res) {
  try {
    const setResult = await prisma.SalesSet.create({
      data: {
        SetBookingId: parseInt(req.body.bookingId),
        SetPerformanceId: parseInt(req),
        SetSalesFiguresDate: req.body.salesDate,
        SetBrochureReleased: false,
        SetSingleSeats: false,
        SetNotOnSale: false,
        SetIsFinalFigures: false,
        SetIsCopy: false,
      },
    });

    const sales = [];

    if (req.body.general) {
      sales.push(
        {
          SaleSaleTypeId: 1,
          SaleSeats: req.body.general.seatsSold,
          SaleValue: req.body.general.seatsSoldVal,
          SaleSetId: setResult.SetId,
        },
        {
          SaleSaleTypeId: 2,
          SaleSeats: req.body.general.seatsReserved,
          SaleValue: req.body.general.seatsReservedVal,
          SaleSetId: setResult.SetId,
        },
      );
    }

    if (req.body.schools) {
      sales.push(
        {
          SaleSaleTypeId: 3,
          SaleSeats: req.body.schools.seatsSold,
          SaleValue: req.body.schools.seatsSoldVal,
          SaleSetId: setResult.SetId,
        },
        {
          SaleSaleTypeId: 4,
          SaleSeats: req.body.schools.seatsReserved,
          SaleValue: req.body.schools.seatsReservedVal,
          SaleSetId: setResult.SetId,
        },
      );
    }

    const saleResult = await prisma.Sale.createMany({
      data: sales,
    });

    res.status(200).json({ sales: saleResult, salesSet: setResult });
  } catch (e) {
    console.error('Error:', e);
    res.status(500).json({ error: e.message });
  }
}
