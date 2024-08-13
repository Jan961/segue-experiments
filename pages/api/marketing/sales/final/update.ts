import prisma from 'lib/prisma';
import { isNullOrEmpty } from 'utils';

export default async function handle(req, res) {
  try {
    const { SetId, general, schools } = req.body;

    const salesUpdates = [];

    if (!isNullOrEmpty(general)) {
      // get saleId
      const sale = await prisma.Sale.findFirst({
        where: {
          SaleSetId: SetId,
          SaleSaleTypeId: 1,
        },
        select: {
          SaleId: true,
        },
      });

      if (!isNullOrEmpty(sale)) {
        salesUpdates.push(
          prisma.Sale.update({
            where: {
              SaleId: sale.SaleId,
            },
            data: {
              SaleSeats: general.seatsSold,
              SaleValue: general.seatsSoldVal,
            },
          }),
        );
      }
    }

    if (!isNullOrEmpty(schools)) {
      // get saleId
      const sale = await prisma.Sale.findFirst({
        where: {
          SaleSetId: SetId,
          SaleSaleTypeId: 1,
        },
        select: {
          SaleId: true,
        },
      });

      if (!isNullOrEmpty(sale)) {
        salesUpdates.push(
          prisma.Sale.update({
            where: {
              SaleId: sale.SaleId,
            },
            data: {
              SaleSeats: schools.seatsSold,
              SaleValue: schools.seatsSoldVal,
            },
          }),
        );
      }
    }

    await prisma.$transaction(salesUpdates);

    res.status(200).json({ setId: SetId });
  } catch (e) {
    console.log(e);
    res.status(401);
  }
}
