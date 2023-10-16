import prisma from 'lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

type UpsertSalesParams = {
  SetBookingId: string
  SetPerformanceId?: string
  SetSalesFiguresDate?: string
  isFinalFigures?: string
}

type SaleResponse = {
  Seats: number,
  Value: string,
  ReservedSeats: number,
  ReservedValue: string,
  SchoolSeats: number,
  SchoolValue: string
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

type BookingNotes = {
  HoldNotes:string
  CompNotes:string
  SalesNotes:string
}

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { SetBookingId, SetPerformanceId, SetSalesFiguresDate, isFinalFigures } = req.body as UpsertSalesParams
    const SetSalesFiguresDateInISO = new Date(SetSalesFiguresDate)

    const salesSet = await prisma.salesSet.findFirst({
      where: {
        SetBookingId: parseInt(SetBookingId),
        ...(SetPerformanceId && { SetPerformanceId }),
        ...(SetSalesFiguresDate && {
          SetSalesFiguresDate: {
            equals: SetSalesFiguresDateInISO
          }
        }),
        ...(isFinalFigures && { SetIsFinalFigures: isFinalFigures })
      },
      select: {
        SetBookingId: true,
        SetPerformanceId: true,
        SetSalesFiguresDate: true,
        Booking: {
          select: {
            SalesNotes: true,
            HoldNotes: true,
            CompNotes: true
          }
        },
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
      return res.status(200).json({ SetComp: [], SetHold: [], Sale: null })
      // throw new Error('No such SalesSet exists')
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

    const Notes: BookingNotes = salesSet.Booking
    const generalSalesData: SalesData[] = saleData.filter(x => x.SaleTypeName === 'General Sales')
    const generalReservationsData: SalesData[] = saleData.filter(x => x.SaleTypeName === 'General Reservations')
    const schoolSalesData: SalesData[] = saleData.filter(x => x.SaleTypeName === 'School Sales')
    // const schoolReservationsData: SalesData[] = saleData.filter(x=> x.SaleTypeName === 'School Reservations')

    const finalSalesData: SaleResponse = {
      Seats: generalSalesData?.[0]?.SaleSeats,
      Value: generalSalesData?.[0]?.SaleValue,
      ReservedSeats: generalReservationsData?.[0]?.SaleSeats,
      ReservedValue: generalReservationsData?.[0]?.SaleValue,
      SchoolSeats: schoolSalesData?.[0]?.SaleSeats,
      SchoolValue: schoolSalesData?.[0]?.SaleValue
    }

    res.status(200).json({ ...salesSet, SetComp: compData, SetHold: holdData, Sale: finalSalesData, Notes })
  } catch (err) {
    console.log('error', err)
    res.status(500).json({ err: err?.message || 'Error updating AvailableComp' })
  }
}
