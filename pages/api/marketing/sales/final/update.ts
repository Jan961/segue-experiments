import prisma from 'lib/prisma';
import { isNullOrEmpty } from 'utils';

export default async function handle(req, res) {
  try {
    const { SetId, general, schools } = req.body;

    const salesUpdates = [];

    if (!isNullOrEmpty(general)) {
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

    if (!isNullOrEmpty(schools)) {
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
