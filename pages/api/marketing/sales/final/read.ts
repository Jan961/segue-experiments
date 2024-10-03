import getPrismaClient from 'lib/prisma';

export default async function handle(req, res) {
  try {
    const bookingId = parseInt(req.body.bookingId);
    const prisma = await getPrismaClient(req);

    // Fetch data using Prisma Client
    const data = await prisma.salesView.findMany({
      where: {
        BookingId: bookingId,
        SetIsFinalFigures: true,
        SaleTypeName: {
          not: '',
        },
      },
      select: {
        SaleTypeName: true,
        Seats: true,
        Value: true,
        SetSalesFiguresDate: true,
        SetProductionWeekDate: true,
        SetIsFinalFigures: true,
        SetFinalSalesApprovedByUser: true,
        SetId: true,
      },
      orderBy: {
        SetSalesFiguresDate: 'desc',
      },
    });

    // Group by SaleTypeName and get the latest entry for each type
    const groupedData = data.reduce((acc, item) => {
      if (!acc[item.SaleTypeName]) {
        acc[item.SaleTypeName] = item;
      }
      return acc;
    }, {});

    const schoolSales = groupedData['School Sales'];
    const generalSales = groupedData['General Sales'];

    const result = {
      schools: {
        seatsSold: schoolSales?.Seats === undefined ? '' : schoolSales.Seats,
        seatsSoldVal: schoolSales?.Value === undefined ? '' : schoolSales.Value,
      },
      general: {
        seatsSold: generalSales?.Seats === undefined ? '' : generalSales.Seats,
        seatsSoldVal: generalSales?.Value === undefined ? '' : generalSales.Value,
      },
      user: '',
      setId: generalSales?.SetId,
    };

    if (generalSales?.SetFinalSalesApprovedByUser) {
      result.user = generalSales.SetFinalSalesApprovedByUser;
    } else if (schoolSales?.SetFinalSalesApprovedByUser) {
      result.user = schoolSales.SetFinalSalesApprovedByUser;
    }

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err: 'Error occurred getting current days sales.' });
  }
}
