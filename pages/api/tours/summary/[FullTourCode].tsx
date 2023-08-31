import prisma from 'lib/prisma'
import moment from 'moment'
import { NextApiRequest, NextApiResponse } from 'next'
import { group, mapValues, pick, sum } from 'radash'

type ScheduleView = {
  RehearsalStartDate: string;
  EntryType: string;
  EntryName: string;
  VenueId: number;
  EntryStatusCode: string;
  TourStartDate: string;
  TourEndDate: string;
  DateTypeName: string;
  SeqNo: string;
  DateTypeId: number;
};

const ShowStatusCodeMap = {
  C: 'Confirmed Performances',
  U: 'Pencilled Performances',
  X: 'Suspended Performances'
}

const getSummaryByKey = (data: any[], key, include = []): any => {
  return Object.values(
    mapValues(
      group(data, (item) => item[key]),
      (group, name) => {
        return {
          name,
          value: group.length,
          ...pick(group?.[0], include)
        }
      }
    )
  )
}

export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { FullTourCode } = req.query
    let showDays = 0
    const data: ScheduleView[] =
      await prisma.$queryRaw`SELECT TourId, RehearsalStartDate, EntryType, EntryStatusCode, EntryName, VenueId, TourStartDate, TourEndDate, DateTypeName, SeqNo, DateTypeId, AffectsAvailability FROM ScheduleView where FullTourCode=${FullTourCode}`
    // const tourStartDate = moment(data?.[0]?.TourStartDate)
    const tourEndDate = moment(data?.[0]?.TourEndDate)
    const rehearsalStartDate = moment(data?.[0]?.RehearsalStartDate)
    const numberOfWeeks = tourEndDate.diff(rehearsalStartDate, 'weeks')
    const numberOfDays = tourEndDate.diff(rehearsalStartDate, 'days') + 1
    const workingDays = numberOfDays - numberOfWeeks
    const workingDayTypes = [
      'Show Days',
      'Rehearsal',
      'GetInFitUp',
      'Travel Day',
      'Declared Holiday'
    ]
    const summaryByEntryStatus = getSummaryByKey(data, 'EntryStatusCode')?.map(
      (summaryItem: any) => ({
        ...summaryItem,
        name: ShowStatusCodeMap[summaryItem.name]
      })
    )
    const pencilledBookings = data.filter(
      (entry) =>
        entry.DateTypeName === 'Booking' && entry.EntryStatusCode === 'U'
    ).length
    const cancelledBookings = data.filter(
      (entry) =>
        entry.DateTypeName === 'Booking' && entry.EntryStatusCode === 'X'
    ).length
    const bookings = data.filter(
      (entry) =>
        entry.DateTypeName === 'Booking' && entry.EntryStatusCode === 'C'
    ).length
    const pencilledRehearsals = data.filter(
      (entry) =>
        entry.DateTypeName === 'Rehearsal' && entry.EntryStatusCode === 'U'
    ).length
    const pencilledDayOff = data.filter(
      (entry) => entry.DateTypeId === 6 && entry.EntryStatusCode === 'U'
    ).length
    console.log('====', {
      pencilledBookings,
      bookings,
      pencilledRehearsals,
      cancelledBookings,
      pencilledDayOff
    })
    const entryTypeSummary = getSummaryByKey(
      data.filter((item) => item.EntryStatusCode !== 'X'),
      'DateTypeName',
      ['AffectsAvailability', 'DateTypeId', 'DateTypeName', 'SeqNo']
    )
      ?.filter((summaryItem: any) => {
        if (summaryItem.name === 'Booking') {
          showDays = summaryItem.value
          // return { ...summaryItem, name: 'Bookings', value: showDays }
          return false
        }
        return summaryItem
      })
      .sort((a, b) => parseInt(a.SeqNo) - parseInt(b.SeqNo))
    const otherDays = sum(
      entryTypeSummary
        .filter((item) => workingDayTypes.includes(item.name))
        .map((item) => item.value)
    )
    const totalPerformances = sum(
      summaryByEntryStatus.map((item) => item.value)
    )
    const totalVenuesonTour: number = Object.keys(
      group(data, (item: any) => item?.VenueId)
    ).length
    res.status(200).json({
      ok: true,
      data: [
        [
          {
            name: 'Tour Duration Days',
            value: numberOfDays
          }
        ],
        [
          {
            name: 'Available Working Days',
            value: workingDays
          }
        ],
        [
          {
            name: 'Bookings(Pencilled)',
            value: pencilledBookings
          },
          {
            name: 'Bookings',
            value: bookings
          },
          ...entryTypeSummary
        ],
        [
          {
            name: 'Remaining Days',
            value: workingDays - otherDays
          }
        ],
        [
          {
            name: 'Bookings(Cancelled)',
            value: cancelledBookings
          },
          {
            name: 'Rehearsals(Pencilled)',
            value: pencilledRehearsals
          },
          {
            name: 'Day Off(Pencilled)',
            value: pencilledDayOff
          }
        ],
        [
          {
            name: 'Total Performances',
            value: totalPerformances
          }
        ],
        [
          {
            name: 'Venues on Tour',
            value: totalVenuesonTour
          }
        ]
      ]
    })
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({
        ok: false,
        message: error?.message || 'Error Deleting Performance'
      })
  }
}
