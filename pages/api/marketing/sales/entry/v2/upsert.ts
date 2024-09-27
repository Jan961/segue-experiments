import getPrismaClient from 'lib/prisma';
import { isNullOrEmpty } from 'utils';

export default async function handle(req, res) {
  try {
    const prisma = await getPrismaClient(req);
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
    } else {
      const saleSetRecord = await prisma.salesSet.findFirst({
        where: {
          SetSalesFiguresDate: salesDate,
          SetBookingId: bookingId,
        },
        select: {
          SetId: true,
        },
      });
      if (isNullOrEmpty(saleSetRecord)) {
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
      } else {
        setId = saleSetRecord.SetId;
      }
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

    for (const sale of sales) {
      const recordFound = await prisma.Sale.findFirst({
        where: {
          SaleSetId: setId,
          SaleSaleTypeId: sale.SaleSaleTypeId,
        },
      });
      if (isNullOrEmpty(recordFound)) {
        await prisma.Sale.create({
          data: sale,
        });
      } else {
        await prisma.Sale.update({ where: { SaleId: recordFound.SaleId }, data: sale });
      }
    }

    res.status(200).json({ setId, transaction: action });
  } catch (e) {
    console.error('Error:', e);
    res.status(500).json({ error: e.message });
  }
}
