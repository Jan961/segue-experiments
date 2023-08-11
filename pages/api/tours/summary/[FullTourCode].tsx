import prisma from 'lib/prisma'
import moment from 'moment';
import { NextApiRequest, NextApiResponse } from 'next'
import { group, mapValues, sum } from 'radash'

type ScheduleView={
  EntryType:string;
  EntryName:string;
  VenueId:number;
  EntryStatusCode:string;
  TourStartDate:string;
  TourEndDate:string;
}

const ShowStatusCodeMap = {
  C: 'Confirmed Performances',
  U: 'Unconfirmed Performances',
  X: 'Suspended Performances'
}

const getSummaryByKey = (data:any[], key) => {
  return Object.values(mapValues(group(data, item => item[key]), (group, name) => {
    return {
      name,
      value: group.length
    }
  }))
}

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
  try {
    const { FullTourCode } = req.query
    const data: ScheduleView[] = await prisma.$queryRaw`SELECT EntryType, EntryStatusCode, EntryName, VenueId, TourStartDate, TourEndDate FROM ScheduleView where FullTourCode=${FullTourCode}`
    const tourStartDate = moment(data?.[0]?.TourStartDate)
    const tourEndDate = moment(data?.[0]?.TourEndDate)
    const numberOfWeeks = tourEndDate.diff(tourStartDate, 'weeks')
    const numberOfDays = tourEndDate.diff(tourStartDate, 'days')
    const workingDays = numberOfDays - numberOfWeeks
    const entryTypeSummary = getSummaryByKey(data, 'EntryType')?.map((summaryItem:any) => ({ ...summaryItem, name: summaryItem.name === 'Booking' ? 'Show Days' : summaryItem.name }))
    const summaryByEntryStatus = getSummaryByKey(data, 'EntryStatusCode')?.map((summaryItem:any) => ({ ...summaryItem, name: ShowStatusCodeMap[summaryItem.name] }))
    const totalVenuesonTour:number = Object.keys(group(data, (item:any) => item?.VenueId)).length
    res.status(200).json({
      ok: true,
      data: [
        ...entryTypeSummary,
        ...summaryByEntryStatus,
        {
          name: 'Total Venues on Tour',
          value: totalVenuesonTour
        },
        {
          name: 'Available Working Days',
          value: workingDays
        }
      ]
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ ok: false, message: error?.message || 'Error Deleting Performance' })
  }
}
