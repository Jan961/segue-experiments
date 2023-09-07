import { loggingService } from 'services/loggingService'
import prisma from 'lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { checkAccess, getEmailFromReq } from 'services/userService'

export interface MarketingActivitiesBookingInfoParams {
  Id: number
  IsOnSale: boolean
  OnSaleDate: string
  MarketingPlanReceived: boolean
  ContactInfoReceived: boolean
  PrintReqsReceived: boolean
}

export default async function handle (req: NextApiRequest, res: NextApiResponse) {
  try {
    const data = req.body as MarketingActivitiesBookingInfoParams

    const email = await getEmailFromReq(req)
    const access = await checkAccess(email, { BookingId: data.Id })
    if (!access) return res.status(401).end()

    await prisma.booking.update({
      where: {
        Id: data.Id
      },
      data: {
        IsOnSale: data.IsOnSale,
        OnSaleDate: new Date(data.OnSaleDate),
        MarketingPlanReceived: data.MarketingPlanReceived,
        ContactInfoReceived: data.ContactInfoReceived,
        PrintReqsReceived: data.PrintReqsReceived
      }
    })
    res.status(200).json({})
  } catch (err) {
    await loggingService.logError(err)
    console.log(err)
    res.status(500).json({ err: 'Error updating Booking' })
  }
}
