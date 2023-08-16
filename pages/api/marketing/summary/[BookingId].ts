import { loggingService } from 'services/loggingService'
import prisma from 'lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { PerformanceDTO, BookingDTO } from 'interfaces'
import { calculateWeekNumber } from 'services/dateService'

export type SummaryResponseDTO = {
  Performances: PerformanceDTO[]
  Info: {
    Seats: number
    GrossPotential: number
    SalesValue:number
    VenueCurrencyCode:string
    VenueCurrencySymbol:string
    ConversionRate:number
    AvgTicketPrice:number
    seatsSalePercentage:number
    Capacity:number
  }
  TourInfo: {
    Date: string
    StartDate: string
    week:number
  }
  Notes: {
    BookingDealNotes:string,
    BookingNotes:string,
    MarketingDealNotes:string,
    HoldNotes:string,
    CompNotes:string
  }
}

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  try {
    const BookingId = parseInt(req.query?.BookingId as string, 10)
    const performance: any = await prisma.performance.findFirst({
      where: {
        BookingId
      },
      orderBy: {
        Date: 'asc'
      },
      take: 1
    })

    const performances:any[] = await prisma.performance.findMany({
      distinct: ['Date'],
      select: {
        Id: true,
        Date: true,
        Time: true
      },
      where: {
        BookingId
      }
    })
    const NumberOfPerformances: number = performances.length

    const SalesSetTotalsView: any = await prisma.$queryRaw`select
    SetSalesFiguresDate as SaleFiguresDate,
    SetIsFinalFigures,
    Seats as TotalSeats,
    Value as TotalSales
    from SalesSetTotalsView
    where
        SaleTypeName in ('General Sales','School Sales')
        and SetBookingId = ${BookingId}
    order by SetSalesFiguresDate desc
    limit 1;`
    const salesSummary:any = SalesSetTotalsView?.[0]
    const booking: any = await prisma.booking.findFirst({
      select: {
        FirstDate: true,
        VenueId: true,
        DealNotes: true,
        Notes: true,
        MarketingDealNotes: true,
        HoldNotes: true,
        CompNotes: true,
        Venue: {
          select: {
            Seats: true,
            CurrencyCode: true,
            Currency: {
              select: {
                CurrencySymbol: true
              }
            }
          }
        },
        DateBlock: {
          select: {
            StartDate: true,
            EndDate: true,
            Tour: {
              select: {
                ConversionRate: {
                  select: {
                    ConversionRate: true
                  }
                }
              }
            }
          }
          // where: {
          //   Name: 'Tour'
          // }
        }
      },
      where: {
        Id: BookingId,
        NOT: {
          VenueId: {
            equals: undefined
          }
        }
      }
    })
    const {
      DealNotes: BookingDealNotes,
      Notes: BookingNotes,
      MarketingDealNotes,
      HoldNotes,
      CompNotes
    } = booking || {}
    const { Seats: Capacity, CurrencyCode } = booking?.Venue || {}
    const { CurrencySymbol } = booking?.Venue?.Currency || {}
    const { ConversionRate } = performance?.DateBlock?.Tour?.ConversionRate || {}
    const AvgTicketPrice = salesSummary.TotalSales / salesSummary.TotalSeats
    const TotalSeats = Capacity * NumberOfPerformances
    const GrossProfit = AvgTicketPrice * TotalSeats
    const seatsSalePercentage = (salesSummary.TotalSeats / TotalSeats) * 100
    const currentTourWeekNum = calculateWeekNumber(new Date(), new Date(booking.FirstDate))
    const result: SummaryResponseDTO = {
      Performances: performances,
      Info: {
        Seats: salesSummary.TotalSeats,
        SalesValue: salesSummary.TotalSales,
        AvgTicketPrice: parseFloat(AvgTicketPrice.toFixed(2)),
        GrossPotential: parseFloat(GrossProfit.toFixed(2)),
        VenueCurrencyCode: CurrencyCode,
        VenueCurrencySymbol: CurrencySymbol,
        seatsSalePercentage: parseFloat(seatsSalePercentage.toFixed(2)),
        Capacity: TotalSeats,
        ConversionRate
      },
      TourInfo: {
        StartDate: booking?.DateBlock.StartDate,
        Date: salesSummary.SaleFiguresDate,
        week: currentTourWeekNum
      },
      Notes: {
        BookingDealNotes,
        BookingNotes,
        MarketingDealNotes,
        HoldNotes,
        CompNotes
      }
    }

    res.status(200).json(result)
  } catch (err) {
    await loggingService.logError('Performance Issue' + err)
    res.status(403).json({ err: 'Error occurred while generating search results.' + err })
  }
}
