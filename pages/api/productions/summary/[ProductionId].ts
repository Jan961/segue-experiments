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
    const productionSummary: any[] =
      await prisma.$queryRaw`SELECT * from ProductionSummaryView where ProductionId=${ProductionId}`;
    const production = productionView?.[0];
    const prodCode = data?.[0]?.FullProductionCode;
    const productionEndDate = newDate(production.ProductionEndDate.getTime());
    const rehearsalStartDate = newDate(production.RehearsalStartDate.getTime());
    const numberOfWeeks = getDifferenceInWeeks(rehearsalStartDate, productionEndDate);
    const numberOfDays = getDifferenceInDays(rehearsalStartDate, productionEndDate) + 1;
    const workingDays = numberOfDays - numberOfWeeks;

    const filterSummary = productionSummary.map((e) => {
      switch (e.StatusCode) {
        case 'C':
          return { name: `${e.Item}`, value: e.Count.toString(), prodCode, bold: false };
        case 'U':
          return { name: `${e.Item} (Pencilled)`, value: e.Count.toString(), prodCode, bold: false };
        case 'X':
          return { name: `${e.Item} (Cancelled)`, value: e.Count.toString(), prodCode, bold: false };
        case 'S':
          return { name: `${e.Item} (Suspended)`, value: e.Count.toString(), prodCode, bold: false };
        default:
          return {};
      }
    });

    const dayTypeFiltered = filterSummary.filter((item) => !item.name.includes('Booking'));
    const performancesFiltered = () => {
      const filter = filterSummary
        .filter((item) => item.name.includes('Booking'))
        .map((e) => ({ ...e, name: e.name.replace('Booking', 'Performance') }));
      let pencilFound = false;
      filter.forEach((item) => {
        if (item.name.includes('(Pencilled)')) {
          pencilFound = true;
        }
      });
      return pencilFound ? filter : [...filter, { name: `Performance (Pencilled)`, value: '0', prodCode, bold: false }];
    };

    const bookings = sum(
      productionSummary
        .filter((entry) => entry.Item === 'Booking' && entry.StatusCode === 'C')
        .map((summary) => Number(summary.Count)),
    );
    const entryTypeSummary = productionSummary
      .filter((summaryItem) => summaryItem.StatusCode === 'C' && !['Booking'].includes(summaryItem.Item))
      .sort((a, b) => a.DateTypeSeqNo - b.DateTypeSeqNo)
      .map((item) => ({ name: item.Item, value: Number(item.Count), order: item.DateTypeSeqNo, prodCode }));
    const summary = objectify(entryTypeSummary, (s) => s.name);
    const otherDays = sum(
      productionSummary
        .filter((item) => item.StatusCode === 'C' && item.Item !== 'Rehearsal')
        .map((item) => Number(item.Count)),
    );
    const totalVenuesonProduction: number = Object.keys(group(data, (item: any) => item?.VenueId)).length;
    res.status(200).json({
      ok: true,
      data: [
        dayTypeFiltered,
        performancesFiltered().sort((a, b) => b.name.localeCompare(a.name)),
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
