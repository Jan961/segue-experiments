import prisma from 'lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

type UpsertSalesParams = {
  SetBookingId: string
  SetPerformanceId?: string
  SetSalesFiguresDate?: string
}

type SaleResponse = {
  Seats: number,
  Value: string,
  ReservedSeats: number,
  ReservedValue: string
}

type CompResponse = {
  CompTypeId: number,
  CompSeats: number,
  CompTypeName: string
}

type HoldResponse = {
  HoldTypeId: number,
  HoldSeats: number,
  HoldValue:string,
  HoldTypeName: string
}

type SalesData = {
  SaleTypeId: number,
  SaleSeats: number,
  SaleValue: string,
  SaleTypeName: string
}

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { SetBookingId, SetPerformanceId, SetSalesFiguresDate } = req.body as UpsertSalesParams
    const SetSalesFiguresDateInISO = new Date(SetSalesFiguresDate).toISOString()

    const salesSet = await prisma.salesSet.findFirst({
      where: {
        SetBookingId: parseInt(SetBookingId),
        ...(SetPerformanceId && { SetPerformanceId }),
        ...(SetSalesFiguresDateInISO && { SetSalesFiguresDate: SetSalesFiguresDateInISO })
      },
      select: {
        SetBookingId: true,
        SetPerformanceId: true,
        SetSalesFiguresDate: true,
        SetComp: {
          select: {
            SetCompCompTypeId: true,
            SetCompSeats: true,
            CompType: {
              select: {
                CompTypeName: true
              }
            }
          }
        },
        SetHold: {
          select: {
            SetHoldHoldTypeId: true,
            SetHoldSeats: true,
            SetHoldValue: true,
            HoldType: {
              select: {
                HoldTypeName: true
              }
            }
          }
        },
        Sale: {
          select: {
            SaleSaleTypeId: true,
            SaleSeats: true,
            SaleValue: true,
            SaleType: {
              select: {
                SaleTypeName: true
              }
            }
          }
        }
      }
    })

    if (!salesSet) {
      throw new Error('No such SalesSet exists')
    }

    const holdData: HoldResponse[] = salesSet.SetHold.map(({ SetHoldHoldTypeId, SetHoldSeats, SetHoldValue, HoldType }) => ({
      HoldTypeId: SetHoldHoldTypeId,
      HoldSeats: SetHoldSeats,
      HoldValue: SetHoldValue,
      HoldTypeName: HoldType.HoldTypeName
    }))
    const compData: CompResponse[] = salesSet.SetComp.map(({ SetCompCompTypeId, SetCompSeats, CompType }) => ({
      CompTypeId: SetCompCompTypeId,
      CompSeats: SetCompSeats,
      CompTypeName: CompType.CompTypeName
    }))
    const saleData: SalesData[] = salesSet.Sale.map(({ SaleSaleTypeId, SaleSeats, SaleValue, SaleType }) => ({
      SaleTypeId: SaleSaleTypeId,
      SaleSeats,
      SaleValue,
      SaleTypeName: SaleType.SaleTypeName
    }))

    const generalSalesData: SalesData[] = saleData.filter(x => x.SaleTypeName === 'General Sales')
    const generalReservationsData: SalesData[] = saleData.filter(x => x.SaleTypeName === 'General Reservations')

    const finalSalesData: SaleResponse = {
      Seats: generalSalesData?.[0]?.SaleSeats,
      Value: generalSalesData?.[0]?.SaleValue,
      ReservedSeats: generalReservationsData?.[0]?.SaleSeats,
      ReservedValue: generalReservationsData?.[0]?.SaleValue
    }

    res.status(200).json({ ...salesSet, SetComp: compData, SetHold: holdData, Sale: finalSalesData })
  } catch (err) {
    console.log(err)
    res.status(500).json({ err: err?.message || 'Error updating AvailableComp' })
  }
}
