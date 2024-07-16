import prisma from 'lib/prisma';

export default async function handle(req, res) {
  try {
    let { bookingId, salesDate, general, schools, setId } = req.body;

    const transactionState = setId === -1 ? 'create' : 'update';

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

    if (general.seatsSold !== null || general.seatsSoldVal !== null) {
      sales.push({
        SaleSaleTypeId: 1,
        SaleSeats: general.seatsSold,
        SaleValue: general.seatsSoldVal,
        SaleSetId: setId,
      });
    }

    if (general.seatsReserved !== null || general.seatsReservedVal !== null) {
      sales.push({
        SaleSaleTypeId: 2,
        SaleSeats: general.seatsReserved,
        SaleValue: general.seatsReservedVal,
        SaleSetId: setId,
      });
    }

    if (schools.seatsSold !== null || schools.seatsSoldVal !== null) {
      sales.push({
        SaleSaleTypeId: 3,
        SaleSeats: schools.seatsSold,
        SaleValue: schools.seatsSoldVal,
        SaleSetId: setId,
      });
    }

    if (schools.seatsReserved !== null || schools.seatsReservedVal !== null) {
      sales.push({
        SaleSaleTypeId: 4,
        SaleSeats: schools.seatsReserved,
        SaleValue: schools.seatsReservedVal,
        SaleSetId: setId,
      });
    }

    if (transactionState === 'create') {
      await prisma.Sale.createMany({
        data: sales,
      });
    } else if (transactionState === 'update') {
      const salesUpdates = [];

      sales.forEach((sale) => {
        salesUpdates.push(
          prisma.Sale.update({
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

    res.status(200).json({ setId, transaction: transactionState });
  } catch (e) {
    console.error('Error:', e);
    res.status(500).json({ error: e.message });
  }
}
