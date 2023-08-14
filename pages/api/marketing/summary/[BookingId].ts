import { loggingService } from 'services/loggingService'
import prisma from 'lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { PerformanceDTO } from 'interfaces'

export type SummaryResponseDTO = {
  Performances: PerformanceDTO[]
  Info: {
    Seats: number
    GrossProfit: number
    SalesValue:number
    VenueCurrencyCode:string
    VenueCurrencySymbol:string
    ConversionRate:number
    AvgTicketPrice:number
  }
  TourInfo: {
    Date: string
    StartDate: string
    week:number
  }
  Notes: {
    Booking: string
    Contract: string
  }
}

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { BookingId } = req.query
    const saleSummary:any[] = await prisma.$queryRaw`Select * from SalesSummaryView where EntryId=${BookingId}`
    const { TourWeekNum, EntryDate, Value, TourStartDate, VenueCurrencyCode, VenueCurrencySymbol, ConversionRate, Capacity = 0, Seats = 0, Perfromances = 0 } = saleSummary?.[0] || {}
    const AvgTicketPrice = Value / Seats
    const TotalSeats = Capacity * Perfromances
    const GrossProfit = AvgTicketPrice * TotalSeats
    const result: SummaryResponseDTO = {
      Performances: [],
      Info: {
        Seats,
        SalesValue: Value,
        AvgTicketPrice,
        GrossProfit,
        VenueCurrencyCode,
        VenueCurrencySymbol,
        ConversionRate
      },
      TourInfo: {
        StartDate: TourStartDate,
        Date: EntryDate,
        week: TourWeekNum
      },
      Notes: {
        Booking: 'Notes about the booking...',
        Contract: 'Notes about the contract...'
      }
    }

    res.status(200).json(result)
  } catch (err) {
    await loggingService.logError('Performance Issue' + err)
    res.status(403).json({ err: 'Error occurred while generating search results.' + err })
  }
}
