import { ActivityDTO } from 'interfaces'
import { activityMapper } from 'lib/mappers'
import prisma from 'lib/prisma'

export type ActivitiesResponse = {
  info: {
    IsOnSale: boolean
    OnSaleDate: string
    MarketingPlanReceived: boolean
    ContactInfoReceived: boolean
    PrintReqsReceived: boolean
  }
  activities: ActivityDTO[]
  activityTypes: { Id: number, Name: string }[]
}

export default async function handle (req, res) {
  try {
    const BookingId = parseInt(req.query.BookingId)

    const activityTypes = await prisma.activityType.findMany({
      select: {
        Name: true,
        Id: true
      }
    })

    const info = await prisma.booking.findUnique({
      where: {
        Id: BookingId
      },
      select: {
        IsOnSale: true,
        OnSaleDate: true,
        MarketingPlanReceived: true,
        ContactInfoReceived: true,
        PrintReqsReceived: true
      }
    })

    const activities = await prisma.bookingActivity.findMany({
      where: {
        BookingId
      }
    })

    const result = {
      activityTypes,
      activities: activities.map(activityMapper),
      info: {
        ...info,
        OnSaleDate: info.OnSaleDate ? info.OnSaleDate.toISOString() : ''
      }
    }

    res.json(result)
  } catch (err) {
    console.log(err)
    res.status(500).json({ err: 'Error occurred while generating search results.' })
  }
}
