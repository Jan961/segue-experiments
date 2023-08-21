import prisma from 'lib/prisma'
import moment from 'moment'
import { NextApiRequest, NextApiResponse } from 'next'
import { group, mapValues, sum } from 'radash'

type ScheduleView={
  RehearsalStartDate:string;
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
    const data: ScheduleView[] = await prisma.$queryRaw`SELECT TourId, RehearsalStartDate, EntryType, EntryStatusCode, EntryName, VenueId, TourStartDate, TourEndDate FROM ScheduleView where FullTourCode=${FullTourCode}`
    // const tourStartDate = moment(data?.[0]?.TourStartDate)
    const tourEndDate = moment(data?.[0]?.TourEndDate)
    const rehearsalStartDate = moment(data?.[0]?.RehearsalStartDate)
    const numberOfWeeks = tourEndDate.diff(rehearsalStartDate, 'weeks')
    const numberOfDays = tourEndDate.diff(rehearsalStartDate, 'days') + 1
    const workingDays = numberOfDays - numberOfWeeks
    const workingDayTypes = ['Show Days', 'Rehearsal', 'GetInFitUp', 'Travel Day', 'Declared Holiday']
    const summaryByEntryStatus = getSummaryByKey(data, 'EntryStatusCode')?.map((summaryItem:any) => ({ ...summaryItem, name: ShowStatusCodeMap[summaryItem.name] }))
    const entryTypeSummary = getSummaryByKey(data.filter(item => item.EntryStatusCode !== 'X'), 'EntryType')?.map((summaryItem:any) => {
      if (summaryItem.name === 'Booking') {
        showDays = summaryItem.value
        return { name: 'Show Days', value: showDays }
      }
      return summaryItem
    })
    const otherDays = sum(entryTypeSummary.filter(item => workingDayTypes.includes(item.name)).map(item => item.value))
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
          name: 'Remaining Days',
          value: workingDays - otherDays
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
