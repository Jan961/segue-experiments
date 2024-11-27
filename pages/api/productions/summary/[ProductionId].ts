import getPrismaClient from 'lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { group, objectify, sum } from 'radash';
import { getDifferenceInDays, getDifferenceInWeeks, newDate } from 'services/dateService';

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
    const prisma = await getPrismaClient(req);
    // Needs securing?

    const data: ScheduleView[] =
      await prisma.$queryRaw`SELECT ProductionId, RehearsalStartDate, EntryType, EntryStatusCode,FullProductionCode, EntryName, VenueId, ProductionStartDate, ProductionEndDate, DateTypeName, SeqNo, DateTypeId, AffectsAvailability FROM ScheduleView where ProductionId=${ProductionId}`;
    const productionView: any[] =
      await prisma.$queryRaw`SELECT * from ProductionView where ProductionId=${ProductionId}`;
    const productionPerformanceSummary: Partial<ScheduleView>[] =
      await prisma.$queryRaw`SELECT * from ProductionPerformanceSummaryView where ProductionId=${ProductionId}`;
    const productionSummary: any[] =
      await prisma.$queryRaw`SELECT * from ProductionSummaryView where ProductionId=${ProductionId}`;
    const production = productionView?.[0];
    const prodCode = data?.[0]?.FullProductionCode;
    const productionEndDate = newDate(production.ProductionEndDate.getTime());
    const rehearsalStartDate = newDate(production.RehearsalStartDate.getTime());
    const numberOfWeeks = getDifferenceInWeeks(rehearsalStartDate, productionEndDate);
    const numberOfDays = getDifferenceInDays(rehearsalStartDate, productionEndDate) + 1;
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
      .map((item) => ({ name: item.Item, value: Number(item.Count), order: item.DateTypeSeqNo, prodCode }));
    const summary = objectify(entryTypeSummary, (s) => s.name);
    const others = entryTypeSummary.filter(
      (summary) => !['Get-In / Fit-Up', 'Travel Day', 'Rehearsal', 'Declared Holiday'].includes(summary.name),
    );
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
            name: 'Day Off (Pencilled)',
            prodCode,
            value: pencilledDayOff || 0,
            bold: false,
          },
          {
            name: 'Get-In / Fit-Up',
            prodCode,
            value: summary?.['Get-In / Fit-Up']?.value || 0,
            bold: false,
          },
          {
            name: 'Rehearsals (Pencilled)',
            prodCode,
            value: pencilledRehearsals || 0,
            bold: false,
          },
          {
            name: 'Bookings (Pencilled)',
            prodCode,
            value: pencilledBookings || 0,
            bold: false,
          },
          {
            name: 'Bookings (Cancelled)',
            prodCode,
            value: cancelledBookings || 0,
            bold: false,
          },
          ...(others || []),
        ],
        cancelledPerformances > 0
          ? [
              {
                name: 'Performances (Cancelled)',
                prodCode,
                value: Number(cancelledPerformances) || 0,
                bold: false,
              },
              {
                name: 'Total Performances',
                prodCode,
                value: totalPerformances || 0,
                bold: true,
              },
            ]
          : [
              {
                name: 'Total Performances',
                prodCode,
                value: totalPerformances || 0,
                bold: true,
              },
            ],
        [
          {
            name: 'Production Duration Days',
            prodCode,
            value: numberOfDays || 0,
            bold: false,
          },
          {
            name: 'Available Working Days',
            prodCode,
            value: workingDays || 0,
            bold: false,
          },
          {
            name: 'Bookings',
            prodCode,
            value: bookings || 0,
            bold: false,
          },
          {
            name: 'Declared Holiday',
            prodCode,
            value: summary?.['Declared Holiday']?.value || 0,
            bold: false,
          },
          {
            name: 'Rehearsal',
            prodCode,
            value: summary?.Rehearsal?.value || 0,
            bold: false,
          },
          {
            name: 'Travel Days',
            prodCode,
            value: summary?.['Travel Day']?.value || 0,
            bold: false,
          },
          {
            name: 'Remaining Days',
            prodCode,
            value: workingDays - otherDays || 0,
            bold: true,
          },
        ],
        [
          {
            name: 'Venues on Tour',
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
