import { loggingService } from 'services/loggingService';
import prisma from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

type HoldInput = {
  SetHoldHoldTypeId: number;
  SetHoldSeats: number;
  SetHoldValue: number;
};

type CompsInput = {
  SetCompCompTypeId: number;
  SetCompSeats: number;
};

type SaleInput = {
  SaleSaleTypeId: number;
  SaleSeats: number;
  SaleValue: number;
};

type UpsertSalesParams = {
  SetBookingId: string;
  SetPerformanceId: string;
  SetSalesFiguresDate: string;
  Holds?: HoldInput[];
  Comps?: CompsInput[];
  Sales?: SaleInput[];
  isFinalFigures?: boolean;
};

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { SetBookingId, SetPerformanceId, SetSalesFiguresDate, Holds, Comps, Sales, isFinalFigures } =
      req.body as UpsertSalesParams;
    const salesSet = await prisma.salesSet.findFirst({
      where: {
        SetBookingId,
        SetPerformanceId,
        SetSalesFiguresDate,
        ...(isFinalFigures && { SetIsFinalFigures: isFinalFigures })
      }
    })

    if (salesSet) {
      // Update

      await prisma.$transaction(async (tx) => {
        await Promise.all(
          Comps.map(({ SetCompCompTypeId, SetCompSeats }) =>
            tx.setComp.upsert({
              where: {
                SetCompSetId: salesSet.SetId,
                SetCompCompTypeId,
              },
              update: {
                SetCompSeats,
              },
              create: {
                SetCompCompTypeId,
                SetCompSeats,
              },
            }),
          ),
        );

        await Promise.all(
          Holds.map(({ SetHoldHoldTypeId, SetHoldSeats, SetHoldValue }) =>
            tx.setHold.upsert({
              where: {
                SetHoldSetId: salesSet.SetId,
                SetHoldHoldTypeId,
              },
              update: {
                SetHoldSeats,
                SetHoldValue,
              },
              create: {
                SetHoldHoldTypeId,
                SetHoldSeats,
                SetHoldValue,
              },
            }),
          ),
        );

        await Promise.all(
          Sales.map(({ SaleSaleTypeId, SaleSeats, SaleValue }) =>
            tx.sale.upsert({
              where: {
                SaleSetId: salesSet.SetId,
                SaleSaleTypeId,
              },
              update: {
                SaleSeats,
                SaleValue,
              },
              create: {
                SaleSaleTypeId,
                SaleSeats,
                SaleValue,
              },
            }),
          ),
        );
      });
    } else {
      // Create

      await prisma.salesSet.create({
        data: {
          SetBookingId,
          SetPerformanceId,
          SetSalesFiguresDate,
          SetBrochureReleased: 0,
          SetSingleSeats: 0,
          SetNotOnSale: 0,
          SetIsFinalFigures: 0,
          SetIsCopy: 0,
          ...(isFinalFigures && { SetIsFinalFigures: isFinalFigures }),
          ...(Comps && Comps?.length && {
            setComp: {
              create: Comps.map(({ SetCompCompTypeId, SetCompSeats }) => ({
                SetCompCompTypeId,
                SetCompSeats
              }))
            }
          }),
          ...(Holds && Holds?.length && {
            setHold: {
              create: Holds.map(({ SetHoldHoldTypeId, SetHoldSeats, SetHoldValue }) => ({
                SetHoldHoldTypeId,
                SetHoldSeats,
                SetHoldValue
              }))
            }
          }),
          ...(Sales && Sales?.length && {
            sale: {
              create: Sales.map(({ SaleSaleTypeId, SaleSeats, SaleValue }) => ({
                SaleSaleTypeId,
                SaleSeats,
                SaleValue
              }))
            }
          })
        }
      })
    }

    res.status(200).json({});
  } catch (err) {
    await loggingService.logError(err);
    console.log(err);
    res.status(500).json({ err: 'Error updating AvailableComp' });
  }
}
