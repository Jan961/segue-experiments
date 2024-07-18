import prisma from 'lib/prisma';

export default async function handle(req, res) {
  try {
    const { SetId, general, schools } = req.body;

    const salesUpdates = [];

    if (Object.values(general).length > 0) {
      salesUpdates.push(
        prisma.Sale.updateMany({
          where: {
            SaleSetId: SetId,
            SaleSaleTypeId: 1,
          },
          data: {
            SaleSeats: general.seatsSold,
            SaleValue: general.seatsSoldVal,
          },
        }),
      );
    }

    if (Object.values(schools).length > 0) {
      salesUpdates.push(
        prisma.Sale.updateMany({
          where: {
            SaleSetId: SetId,
            SaleSaleTypeId: 3,
          },
          data: {
            SaleSeats: schools.seatsSold,
            SaleValue: schools.seatsSoldVal,
          },
        }),
      );
    }

    await prisma.$transaction(salesUpdates);

    res.status(200).json({ setId: SetId });
  } catch (e) {
    console.log(e);
    res.status(401);
  }
}
