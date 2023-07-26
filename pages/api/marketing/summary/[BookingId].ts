import { loggingService } from 'services/loggingService'
import prisma from 'lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { performanceMapper } from 'lib/mappers'
import { PerformanceDTO } from 'interfaces'

export type SummaryResponseDTO = {
  Performances: PerformanceDTO[]
  Info: {
    Date: string
    Seats: number
    GrossProfit: number
    AvgTicketPrice: number
    Currency: string
  }
  TourInfo: {
    StartDate: string
  }
  Notes: {
    Booking: string
    Contract: string
  }
}

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  try {
    const performances = await prisma.performance.findMany({
      where: {
        BookingId: parseInt(req.query.BookingId as string)
      }
    })

    const result: SummaryResponseDTO = {
      Performances: performances.map(performanceMapper),
      Info: {
        Date: '2023-02-08T00:00:00.000Z',
        Seats: 1234,
        GrossProfit: 1234.59,
        AvgTicketPrice: 12.34,
        Currency: 'GBP'
      },
      TourInfo: {
        StartDate: '2023-01-01T00:00:00.000Z' // .toIsoString
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
