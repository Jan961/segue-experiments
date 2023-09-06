import prisma from 'lib/prisma'
import moment from 'moment'
import { NextApiRequest, NextApiResponse } from 'next'
import { group, mapValues, objectify, pick, sum } from 'radash'

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
  StatusCode?:string;
  Count?:number;
};

export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { FullTourCode } = req.query
    const data: ScheduleView[] =
      await prisma.$queryRaw`SELECT TourId, RehearsalStartDate, EntryType, EntryStatusCode, EntryName, VenueId, TourStartDate, TourEndDate, DateTypeName, SeqNo, DateTypeId, AffectsAvailability FROM ScheduleView where TourId=${FullTourCode}`
    const tourView:any[] = await prisma.$queryRaw`SELECT * from TourView where TourId=${FullTourCode}`
    const tourPerformanceSummary:Partial<ScheduleView>[] = await prisma.$queryRaw`SELECT * from TourPerformanceSummaryView where TourId=${FullTourCode}`
    const tourSummary:any[] = await prisma.$queryRaw`SELECT * from TourSummaryView where TourId=${FullTourCode}`
    console.log(data)
    // const tourStartDate = moment(data?.[0]?.TourStartDate)
    const tour = tourView?.[0]
    const tourEndDate = moment(tour.TourEndDate)
    const rehearsalStartDate = moment(tour.RehearsalStartDate)
    const numberOfWeeks = tourEndDate.diff(rehearsalStartDate, 'weeks')
    const numberOfDays = tourEndDate.diff(rehearsalStartDate, 'days') + 1
    const workingDays = numberOfDays - numberOfWeeks
    const pencilledBookings = sum(tourSummary.filter(
      (entry) =>
        entry.Item === 'Booking' && entry.StatusCode === 'U'
    ).map(summary => Number(summary.Count)))
    const cancelledBookings = sum(tourSummary.filter(
      (entry) =>
        entry.Item === 'Booking' && entry.StatusCode === 'X'
    ).map(summary => Number(summary.Count)))
    const bookings = sum(tourSummary.filter(
      (entry) =>
        entry.Item === 'Booking' && entry.StatusCode === 'C'
    ).map(summary => Number(summary.Count)))
    const pencilledRehearsals = sum(tourSummary.filter(
      (entry) =>
        entry.Item === 'Rehearsal' && entry.StatusCode === 'U'
    ).map(summary => Number(summary.Count)))
    const pencilledDayOff = sum(tourSummary.filter(
      (entry) => entry.DateTypeId === 6 && entry.StatusCode === 'U'
    ).map(summary => Number(summary.Count)))
    const entryTypeSummary = tourSummary.filter(summaryItem => summaryItem.StatusCode === 'C' && !['Booking'].includes(summaryItem.Item)).sort((a, b) => a.DateTypeSeqNo - b.DateTypeSeqNo).map(item => ({ name: item.Item, value: Number(item.Count), order: item.DateTypeSeqNo }))
    const summary = objectify(entryTypeSummary, s => s.name)
    const others = entryTypeSummary.filter(summary => !['Get-In / Fit-Up', 'Travel day', 'Rehearsal', 'Declared Holiday'].includes(summary.name))
    const otherDays = sum(
      tourSummary
        .filter((item) => item.StatusCode === 'C' && item.Item !== 'Rehearsal')
        .map((item) => Number(item.Count))
    )
    const totalPerformances = sum(
      tourPerformanceSummary.filter(item => item.StatusCode === 'C').map((item) => Number(item.Count))
    )
    const cancelledPerformances = tourPerformanceSummary.find(summary => summary.StatusCode === 'X')?.Count || 0
    const totalVenuesonTour: number = Object.keys(
      group(data, (item: any) => item?.VenueId)
    ).length
    res.status(200).json({
      ok: true,
      data: [
        [
          {
            name: 'Tour Duration Days',
            value: numberOfDays || 0
          }
        ],
        [
          {
            name: 'Available Working Days',
            value: workingDays || 0
          }
        ],
        [
          {
            name: 'Bookings(Pencilled)',
            value: pencilledBookings || 0
          },
          {
            name: 'Bookings',
            value: bookings || 0
          },
          {
            name: 'Rehearsal',
            value: summary?.Rehearsal?.value || 0
          },
          {
            name: 'Get-In / Fit-Up',
            value: summary?.['Get-In / Fit-Up']?.value || 0
          },
          {
            name: 'Travel Day',
            value: summary?.['Travel Day']?.value || 0
          },
          {
            name: 'Declared Holiday',
            value: summary?.['Declared Holiday']?.value || 0
          },
          ...(others || [])
        ],
        [
          {
            name: 'Remaining Days',
            value: (workingDays - otherDays) || 0
          }
        ],
        [
          {
            name: 'Bookings(Cancelled)',
            value: cancelledBookings || 0
          },
          {
            name: 'Rehearsals(Pencilled)',
            value: pencilledRehearsals || 0
          },
          {
            name: 'Day Off(Pencilled)',
            value: pencilledDayOff || 0
          }
        ],
        [
          {
            name: 'Total Performances',
            value: totalPerformances || 0
          },
          {
            name: 'Performances(Cancelled)',
            value: Number(cancelledPerformances) || 0
          }
        ],
        [
          {
            name: 'Venues on Tour',
            value: totalVenuesonTour || 0
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
