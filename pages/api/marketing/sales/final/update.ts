import getPrismaClient from 'lib/prisma';
import { isNullOrEmpty } from 'utils';

export default async function handle(req, res) {
  try {
    const prisma = await getPrismaClient(req);
    const { SetId, general, schools, user } = req.body;

    const salesUpdates = [];

    if (!isNullOrEmpty(general)) {
      // get saleId
      const sale = await prisma.sale.findFirst({
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
          prisma.sale.update({
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
      const sale = await prisma.sale.findFirst({
        where: {
          SaleSetId: SetId,
          SaleSaleTypeId: 3,
        },
        select: {
          SaleId: true,
        },
      });

      if (!isNullOrEmpty(sale)) {
        salesUpdates.push(
          prisma.sale.update({
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

    // update the sales set with the user
    await prisma.salesSet.update({
      where: {
        SetId,
      },
      data: {
        SetFinalSalesApprovedByUser: user,
      },
    });

    res.status(200).json({ setId: SetId });
  } catch (e) {
    console.log(e);
    res.status(401);
  }
}
