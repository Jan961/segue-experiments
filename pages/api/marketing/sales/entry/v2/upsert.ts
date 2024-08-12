import prisma from 'lib/prisma';

export default async function handle(req, res) {
  try {
    let { bookingId, salesDate, general, schools, setId, action } = req.body;

    if (setId === -1) {
      const setResult = await prisma.SalesSet.create({
        data: {
          SetBookingId: parseInt(bookingId),
          SetPerformanceId: null,
          SetSalesFiguresDate: salesDate,
          SetBrochureReleased: false,
          SetSingleSeats: false,
          SetNotOnSale: false,
          SetIsFinalFigures: false,
          SetIsCopy: false,
        },
      });

      setId = setResult.SetId;
    }

    const sales = [];

    // only create sales record if SaleSeats or SaleValue are not null

    if (!isNaN(general.seatsSold) || !isNaN(general.seatsSoldVal)) {
      sales.push({
        SaleSaleTypeId: 1,
        SaleSeats: parseInt(general.seatsSold),
        SaleValue: parseFloat(general.seatsSoldVal),
        SaleSetId: setId,
      });
    }

    if (!isNaN(general.seatsReserved) || !isNaN(general.seatsReservedVal)) {
      sales.push({
        SaleSaleTypeId: 2,
        SaleSeats: general.seatsReserved,
        SaleValue: general.seatsReservedVal,
        SaleSetId: setId,
      });
    }

    if (!isNaN(schools.seatsSold) || !isNaN(schools.seatsSoldVal)) {
      sales.push({
        SaleSaleTypeId: 3,
        SaleSeats: schools.seatsSold,
        SaleValue: schools.seatsSoldVal,
        SaleSetId: setId,
      });
    }

    if (!isNaN(schools.seatsReserved) || !isNaN(schools.seatsReservedVal)) {
      sales.push({
        SaleSaleTypeId: 4,
        SaleSeats: schools.seatsReserved,
        SaleValue: schools.seatsReservedVal,
        SaleSetId: setId,
      });
    }

    if (action === 'create') {
      await prisma.Sale.createMany({
        data: sales,
      });
    } else if (action === 'update') {
      const salesUpdates = [];

      // even though only one record should match query, as we don't have the saleID, we need to use updateMany
      sales.forEach((sale) => {
        salesUpdates.push(
          prisma.Sale.updateMany({
            where: {
              SaleSetId: sale.SaleSetId,
              SaleSaleTypeId: sale.SaleSaleTypeId,
            },
            data: {
              SaleSeats: sale.SaleSeats,
              SaleValue: sale.SaleValue,
            },
          }),
        );
      });

      await prisma.$transaction(salesUpdates);
    }

    res.status(200).json({ setId, transaction: action });
  } catch (e) {
    console.error('Error:', e);
    res.status(500).json({ error: e.message });
  }
}
