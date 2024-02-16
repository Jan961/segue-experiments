import prisma from 'lib/prisma';
import moment from 'moment';
import { NextApiRequest, NextApiResponse } from 'next';
import { group, objectify, sum } from 'radash';

type ScheduleView = {
  RehearsalStartDate: string;
  EntryType: string;
  EntryName: string;
  VenueId: number;
  EntryStatusCode: string;
  ProductionStartDate: string;
  ProductionEndDate: string;
  DateTypeName: string;
  SeqNo: string;
  DateTypeId: number;
  StatusCode?: string;
  Count?: number;
  FullProductionCode?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { ProductionId } = req.query;

    // Needs securing?

    const data: ScheduleView[] =
      await prisma.$queryRaw`SELECT ProductionId, RehearsalStartDate, EntryType, EntryStatusCode,FullProductionCode, EntryName, VenueId, ProductionStartDate, ProductionEndDate, DateTypeName, SeqNo, DateTypeId, AffectsAvailability FROM ScheduleView where ProductionId=${ProductionId}`;
    const productionView: any[] =
      await prisma.$queryRaw`SELECT * from ProductionView where ProductionId=${ProductionId}`;
    const productionPerformanceSummary: Partial<ScheduleView>[] =
      await prisma.$queryRaw`SELECT * from ProductionPerformanceSummaryView where ProductionId=${ProductionId}`;
    const productionSummary: any[] =
      await prisma.$queryRaw`SELECT * from ProductionSummaryView where ProductionId=${ProductionId}`;
    // const productionStartDate = moment(data?.[0]?.ProductionStartDate)
    const production = productionView?.[0];
    const prodCode = data?.[0]?.FullProductionCode;
    const productionEndDate = moment(production.ProductionEndDate);
    const rehearsalStartDate = moment(production.RehearsalStartDate);
    const numberOfWeeks = productionEndDate.diff(rehearsalStartDate, 'weeks');
    const numberOfDays = productionEndDate.diff(rehearsalStartDate, 'days') + 1;
    const workingDays = numberOfDays - numberOfWeeks;
    const pencilledBookings = sum(
      productionSummary
        .filter((entry) => entry.Item === 'Booking' && entry.StatusCode === 'U')
        .map((summary) => Number(summary.Count)),
    );
    const cancelledBookings = sum(
      productionSummary
        .filter((entry) => entry.Item === 'Booking' && entry.StatusCode === 'X')
        .map((summary) => Number(summary.Count)),
    );
    const bookings = sum(
      productionSummary
        .filter((entry) => entry.Item === 'Booking' && entry.StatusCode === 'C')
        .map((summary) => Number(summary.Count)),
    );
    const pencilledRehearsals = sum(
      productionSummary
        .filter((entry) => entry.Item === 'Rehearsal' && entry.StatusCode === 'U')
        .map((summary) => Number(summary.Count)),
    );
    const pencilledDayOff = sum(
      productionSummary
        .filter((entry) => entry.DateTypeId === 6 && entry.StatusCode === 'U')
        .map((summary) => Number(summary.Count)),
    );
    const entryTypeSummary = productionSummary
      .filter((summaryItem) => summaryItem.StatusCode === 'C' && !['Booking'].includes(summaryItem.Item))
      .sort((a, b) => a.DateTypeSeqNo - b.DateTypeSeqNo)
      .map((item) => ({ name: item.Item, value: Number(item.Count), order: item.DateTypeSeqNo }));
    const summary = objectify(entryTypeSummary, (s) => s.name);
    const others = entryTypeSummary.filter(
      (summary) => !['Get-In / Fit-Up', 'Travel Day', 'Rehearsal', 'Declared Holiday'].includes(summary.name),
    );
    // const others = entryTypeSummary.filter((summary) => {
    //   if (!['Get-In / Fit-Up', 'Travel Day', 'Rehearsal', 'Declared Holiday'].includes(summary.name)) {
    //     summary['prodCode'] = prodCode;
    //     return summary;
    //   }
    // });

    const otherDays = sum(
      productionSummary
        .filter((item) => item.StatusCode === 'C' && item.Item !== 'Rehearsal')
        .map((item) => Number(item.Count)),
    );
    const totalPerformances = sum(
      productionPerformanceSummary.filter((item) => item.StatusCode === 'C').map((item) => Number(item.Count)),
    );
    const cancelledPerformances =
      productionPerformanceSummary.find((summary) => summary.StatusCode === 'X')?.Count || 0;
    const totalVenuesonProduction: number = Object.keys(group(data, (item: any) => item?.VenueId)).length;
    res.status(200).json({
      ok: true,
      data: [
        [
          {
            name: 'Production Duration Days',
            prodCode,
            value: numberOfDays || 0,
          },
        ],
        [
          {
            name: 'Available Working Days',
            prodCode,
            value: workingDays || 0,
          },
        ],
        [
          {
            name: 'Bookings(Pencilled)',
            prodCode,
            value: pencilledBookings || 0,
          },
          {
            name: 'Bookings',
            prodCode,
            value: bookings || 0,
          },
          {
            name: 'Rehearsal',
            prodCode,
            value: summary?.Rehearsal?.value || 0,
          },
          {
            name: 'Get-In / Fit-Up',
            prodCode,
            value: summary?.['Get-In / Fit-Up']?.value || 0,
          },
          {
            name: 'Travel Day',
            prodCode,
            value: summary?.['Travel Day']?.value || 0,
          },
          {
            name: 'Declared Holiday',
            prodCode,
            value: summary?.['Declared Holiday']?.value || 0,
          },
          ...(others || []),
        ],
        [
          {
            name: 'Remaining Days',
            prodCode,
            value: workingDays - otherDays || 0,
          },
        ],
        [
          {
            name: 'Bookings(Cancelled)',
            prodCode,
            value: cancelledBookings || 0,
          },
          {
            name: 'Rehearsals(Pencilled)',
            prodCode,
            value: pencilledRehearsals || 0,
          },
          {
            name: 'Day Off(Pencilled)',
            prodCode,
            value: pencilledDayOff || 0,
          },
        ],
        [
          {
            name: 'Total Performances',
            prodCode,
            value: totalPerformances || 0,
          },
          {
            name: 'Performances(Cancelled)',
            prodCode,
            value: Number(cancelledPerformances) || 0,
          },
        ],
        [
          {
            name: 'Venues on Production',
            prodCode,
            value: totalVenuesonProduction || 0,
          },
        ],
      ],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      message: error?.message || 'Error Deleting Performance',
    });
  }
}
