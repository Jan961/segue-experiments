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
    const {
      SetBookingId,
      SetPerformanceId,
      SetSalesFiguresDate,
      Holds = [],
      Comps = [],
      Sales = [],
      isFinalFigures = false,
    } = req.body as UpsertSalesParams;
    const SetSalesFiguresDateInISO = new Date(SetSalesFiguresDate);
    const salesSet = await prisma.salesSet.findFirst({
      where: {
        SetBookingId,
        ...(SetPerformanceId && { SetPerformanceId }),
        ...(SetSalesFiguresDate && {
          SetSalesFiguresDate: {
            equals: SetSalesFiguresDateInISO,
          },
        }),
        ...(isFinalFigures && { SetIsFinalFigures: isFinalFigures }),
      },
    });

    if (salesSet) {
      // Update

      await prisma.$transaction(async (tx) => {
        await Promise.all(
          Comps.map(({ SetCompCompTypeId, SetCompSeats }) =>
            tx.setComp.upsert({
              where: {
                Comp_unique: {
                  SetCompSetId: salesSet.SetId,
                  SetCompCompTypeId,
                },
              },
              update: {
                SetCompSeats,
              },
              create: {
                SetCompSeats,
                CompType: {
                  connect: { CompTypeId: SetCompCompTypeId },
                },
                SalesSet: {
                  connect: { SetId: salesSet.SetId },
                },
              },
            }),
          ),
        );

        await Promise.all(
          Holds.map(({ SetHoldHoldTypeId, SetHoldSeats, SetHoldValue }) =>
            tx.setHold.upsert({
              where: {
                Hold_unique: {
                  SetHoldSetId: salesSet.SetId,
                  SetHoldHoldTypeId,
                },
              },
              update: {
                SetHoldSeats,
                SetHoldValue,
              },
              create: {
                SetHoldSeats,
                SetHoldValue,
                HoldType: {
                  connect: { HoldTypeId: SetHoldHoldTypeId },
                },
                SalesSet: {
                  connect: { SetId: salesSet.SetId },
                },
              },
            }),
          ),
        );

        await Promise.all(
          Sales.map(({ SaleSaleTypeId, SaleSeats, SaleValue }) =>
            tx.sale.upsert({
              where: {
                Sale_unique: {
                  SaleSetId: salesSet.SetId,
                  SaleSaleTypeId,
                },
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
          SetPerformanceId,
          SetSalesFiguresDate,
          ...(isFinalFigures && { SetIsFinalFigures: isFinalFigures }),
          ...(Comps &&
            Comps?.length && {
              setComp: {
                create: Comps.map(({ SetCompCompTypeId, SetCompSeats }) => ({
                  SetCompCompTypeId,
                  SetCompSeats,
                })),
              },
            }),
          ...(Holds &&
            Holds?.length && {
              setHold: {
                create: Holds.map(({ SetHoldHoldTypeId, SetHoldSeats, SetHoldValue }) => ({
                  SetHoldHoldTypeId,
                  SetHoldSeats,
                  SetHoldValue,
                })),
              },
            }),
          ...(Sales &&
            Sales?.length && {
              Sale: {
                create: Sales.map(({ SaleSaleTypeId, SaleSeats, SaleValue }) => ({
                  SaleSaleTypeId,
                  SaleSeats,
                  SaleValue,
                })),
              },
            }),
          ...(SetBookingId && {
            Booking: {
              connect: {
                Id: SetBookingId,
              },
            },
          }),
        },
      });
    }

    res.status(200).json({});
  } catch (err) {
    await loggingService.logError(err);
    console.log(err);
    res.status(500).json({ err: 'Error updating AvailableComp' });
  }
}
