import prisma from 'lib/prisma'
import moment from 'moment'
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
  U: 'Pencilled Performances',
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
    let showDays = 0
    const data: ScheduleView[] = await prisma.$queryRaw`SELECT EntryType, EntryStatusCode, EntryName, VenueId, TourStartDate, TourEndDate FROM ScheduleView where FullTourCode=${FullTourCode}`
    const tourStartDate = moment(data?.[0]?.TourStartDate)
    const tourEndDate = moment(data?.[0]?.TourEndDate)
    const numberOfWeeks = tourEndDate.diff(tourStartDate, 'weeks')
    const numberOfDays = tourEndDate.diff(tourStartDate, 'days')
    const workingDays = numberOfDays - numberOfWeeks
    const summaryByEntryStatus = getSummaryByKey(data, 'EntryStatusCode')?.map((summaryItem:any) => ({ ...summaryItem, name: ShowStatusCodeMap[summaryItem.name] }))
    const entryTypeSummary = getSummaryByKey(data.filter(item => item.EntryStatusCode !== 'X'), 'EntryType')?.map((summaryItem:any) => {
      if (summaryItem.name === 'Booking') {
        showDays = summaryItem.value
        return { name: 'Show Days', value: showDays }
      }
      return summaryItem
    })
    const nonBookings = sum(entryTypeSummary.filter(item => item.name === 'Show Days').map(item => item.value))
    const totalPerformances = sum(summaryByEntryStatus.map(item => item.value))
    const totalVenuesonTour:number = Object.keys(group(data, (item:any) => item?.VenueId)).length
    res.status(200).json({
      ok: true,
      data: [
        ...entryTypeSummary,
        ...summaryByEntryStatus,
        {
          name: 'Total Performances',
          value: totalPerformances
        },
        {
          name: 'Venues on Tour',
          value: totalVenuesonTour
        },
        {
          name: 'Tour Duration',
          value: numberOfDays
        },
        {
          name: 'Available Days',
          value: workingDays - nonBookings
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
