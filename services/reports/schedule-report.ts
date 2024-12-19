import { UTCDate } from '@date-fns/utc';
import { bookingStatusMap } from 'config/bookings';
import getPrismaClient from 'lib/prisma';
import { NextApiRequest } from 'next';
import { ScheduleView } from 'prisma/generated/prisma-client';
import { group } from 'radash';
import { areDatesSame, dateTimeToTime, formatDate, getDateDaysAway, getDifferenceInDays } from 'services/dateService';
import { minutesInHHmmFormat } from 'services/salesSummaryService';

export type SCHEDULE_VIEW = {
  ProductionId: number;
  FullProductionCode: string;
  ShowName: string;
  RehearsalStartDate: string;
  ProductionStartDate: string;
  ProductionEndDate: string;
  EntryDate: string;
  ProductionWeekNum: number;
  EntryType: string;
  EntryId: number;
  EntryName: string;
  EntryStatusCode: string;
  Location: string;
  PencilNum: number | null;
  VenueId: number | null;
  VenueSeats: number | null;
  Mileage: number | null;
  TimeMins: string | null;
  DateTypeId: number | null;
  DateTypeName: string;
  AffectsAvailability: number;
  SeqNo: number;
};

export type ScheduleViewFormatted = Omit<ScheduleView, 'EntryDate' | 'ProductionStartDate' | 'ProductionEndDate'> & {
  EntryDate: string;
  ProductionStartDate: string;
  ProductionEndDate: string;
};

export interface PerformanceInfo {
  performanceId: number;
  performanceTime: string | null;
  performanceDate: string | null;
}

export const addTime = (timeArr: string[] = []) => {
  if (!timeArr?.length) {
    return '00:00';
  }
  const { hour, min } = timeArr.reduce(
    (acc, x) => {
      const [h, m] = x.split(':');
      return {
        hour: Number(h) + acc.hour,
        min: Number(m) + acc.min,
      };
    },
    { hour: 0, min: 0 },
  );
  const minsTime = minutesInHHmmFormat(min);
  const [h, m] = minsTime.split(':');
  return `${hour + Number(h)}:${Number(m)}`;
};

const getKey = ({ FullProductionCode, ShowName, EntryDate }) => `${FullProductionCode} - ${ShowName} - ${EntryDate}`;

export const getSheduleReport = async ({ from, to, status, ProductionId }, req: NextApiRequest) => {
  const prisma = await getPrismaClient(req);
  const formatedFromDate = new Date(from);
  const formatedToDate = new Date(to);
  const data = await prisma.scheduleView.findMany({
    where: {
      AND: [
        from && to
          ? {
              EntryDate: {
                gte: formatedFromDate,
                lte: formatedToDate,
              },
            }
          : {},
        ProductionId
          ? {
              ProductionId,
            }
          : {},
        status && status !== 'all'
          ? {
              EntryStatusCode: status,
            }
          : {},
      ],
    },
    orderBy: {
      EntryDate: 'asc',
    },
  });
  const bookingIdPerformanceMap: Record<number, PerformanceInfo[]> = {};
  const bookingIdList: number[] =
    data.map((entry) => (entry.EntryType === 'Booking' ? entry.EntryId : null)).filter((id) => id) || [];

  const performances = await prisma.performance
    .findMany({
      where: {
        BookingId: {
          in: bookingIdList,
        },
      },
    })
    .then((res) =>
      res.map((x) => ({
        ...x,
        Time: new UTCDate(x.Time),
        Date: new UTCDate(x.Date),
      })),
    );
  performances.forEach((performance) => {
    const { Id, BookingId, Time, Date: performanceDate } = performance;

    if (!bookingIdPerformanceMap[BookingId]) {
      bookingIdPerformanceMap[BookingId] = [];
    }

    bookingIdPerformanceMap[BookingId].push({
      performanceId: Id,
      performanceTime: Time ? dateTimeToTime(Time) : null,
      performanceDate: performanceDate ? performanceDate.toISOString() : null,
    });
  });
  const formattedData = data.map((x) => ({
    ...x,
    EntryDate: formatDate(x.EntryDate.getTime(), 'yyyy-MM-dd'),
    ProductionStartDate: formatDate(x.ProductionStartDate.getTime(), 'yyyy-MM-dd'),
    ProductionEndDate: formatDate(x.ProductionEndDate.getTime(), 'yyyy-MM-dd'),
  }));
  const { ShowName, FullProductionCode, ProductionStartDate, ProductionEndDate } = data[0];
  const map: Record<string, ScheduleViewFormatted[]> = group(formattedData, (x: ScheduleViewFormatted) => getKey(x));
  const daysDiff = getDifferenceInDays(from || ProductionStartDate, to || ProductionEndDate);
  let prevProductionWeekNum = '';
  let lastWeekMetaInfo = {
    weekTotalPrinted: false,
    prevProductionWeekNum: '',
  };
  const time: string[] = [];
  const mileage: number[] = [];
  let totalTime: string[] = [];
  let totalMileage: number[] = [];
  const seats: number[] = [];
  const performancesPerDay: number[] = [];
  const rows = [];
  for (let i = 1; i <= daysDiff; i++) {
    lastWeekMetaInfo = { ...lastWeekMetaInfo, weekTotalPrinted: false };
    const weekDay = formatDate(getDateDaysAway(from || ProductionStartDate, i - 1), 'dddd');
    const dateInIncomingFormat = formatDate(getDateDaysAway(from || ProductionStartDate, i - 1), 'yyy-MM-dd');
    const key = getKey({ FullProductionCode, ShowName, EntryDate: dateInIncomingFormat });
    const values = map[key] ?? [];
    for (const value of values) {
      const isOtherDay = isOtherDayType(value?.EntryName);
      const isCancelled = value?.EntryStatusCode === 'X';
      if (!value) {
        rows.push({
          productionCode: FullProductionCode,
          day: weekDay.substring(0, 3),
          date: dateInIncomingFormat,
          week: prevProductionWeekNum,
        });
      } else {
        const {
          ProductionWeekNum,
          Location,
          EntryName,
          TimeMins,
          Mileage,
          VenueSeats,
          EntryId,
          PencilNum,
          EntryStatusCode,
          EntryType = '',
        } = value;
        const formattedTime = TimeMins ? minutesInHHmmFormat(Number(TimeMins)) : '';
        const performances = bookingIdPerformanceMap[EntryId];
        const performancesOnThisDay = performances?.filter?.((performance) =>
          areDatesSame(performance.performanceDate, dateInIncomingFormat),
        );
        time.push(formattedTime || '00:00');
        mileage.push(Number(Mileage) || 0);
        seats.push(Number(VenueSeats) || 0);
        performancesPerDay.push(performances?.length || 0);
        prevProductionWeekNum = ProductionWeekNum ? String(ProductionWeekNum) : prevProductionWeekNum;
        const pencilNum = PencilNum ? `(${PencilNum})` : '';
        rows.push({
          productionCode: FullProductionCode,
          day: weekDay.substring(0, 3),
          date: dateInIncomingFormat,
          week: ProductionWeekNum,
          venue: EntryName || '',
          isOtherDay,
          isCancelled,
          ...((isOtherDay && { location: Location || '', type: EntryType || '' }) || []),
          ...((!isOtherDay &&
            !isCancelled && {
              location: Location || '',
              type: 'Performance',
              status: `${bookingStatusMap?.[EntryStatusCode] || ''}${pencilNum}`,
              capacity: VenueSeats,
              performancesPerDay: performancesOnThisDay?.length,
              performance1: performancesOnThisDay?.[0]?.performanceTime || '',
              performance2: performancesOnThisDay?.[1]?.performanceTime || '',
              mileage: Number(Mileage) || '',
              time: formattedTime,
            }) ||
            []),
        });
      }
    }
    lastWeekMetaInfo = { ...lastWeekMetaInfo, prevProductionWeekNum };
  }
  if (time.length) {
    totalTime = [...totalTime, ...time];
  }
  if (mileage.length) {
    totalMileage = [...totalMileage, ...mileage];
  }
  return {
    rows,
    totalMileage,
    totalSeats: seats.reduce((acc, m) => acc + Number(m || 0), 0),
    performancesPerDay: performancesPerDay.reduce((acc, m) => acc + Number(m || 0), 0),
    totalTime: addTime(totalTime),
  };
};

/**
 * get next confirmed booking
 * @param {
 * index: number,
 * maxDays: number,
 * startDate: string,
 * fullProductionCode: string,
 * showName: string,
 * dataLookUp: Record<string, ScheduleViewFormatted[]>
 * }
 * @returns
 */
export const getNextConfirmedBooking = ({
  index,
  maxDays,
  startDate,
  fullProductionCode,
  showName,
  dataLookUp,
}: {
  index: number;
  maxDays: number;
  startDate: string;
  fullProductionCode: string;
  showName: string;
  dataLookUp: Record<string, ScheduleViewFormatted[]>;
}) => {
  for (let i = index; i < maxDays; i++) {
    const nextDateIncomingFormat = getDateDaysAway(startDate, i);
    const nextKey = getKey({
      FullProductionCode: fullProductionCode,
      ShowName: showName,
      EntryDate: formatDate(nextDateIncomingFormat, 'yyyy-MM-dd'),
    });
    const nextValue = dataLookUp[nextKey];
    if (nextValue?.[0]?.EntryStatusCode === 'C') {
      return nextValue?.[0];
    }
  }
  return null;
};

/**
 * Retrieves the unique entries from the data lookup based on the provided key.
 * @param key - The key to lookup in the dataLookup object.
 * @param dataLookup - The data lookup object containing the schedule view formatted data.
 * @returns An array of unique entries from the data lookup.
 */
export const getBookingByKey = (key: string, dataLookup: Record<string, ScheduleViewFormatted[]>) => {
  // Get values from lookup or default to array with empty object
  const values = dataLookup[key] ?? [{} as ScheduleViewFormatted];

  // Filter unique entries based on EntryName
  const uniqueEntries = values.reduce((acc, current) => {
    if (!acc.some((item) => item.EntryName === current.EntryName)) {
      acc.push(current);
    }
    return acc;
  }, [] as ScheduleViewFormatted[]);

  return uniqueEntries;
};

/**
 *  Get the next non empty booking
 * @param index
 * @param maxDays
 * @param startDate
 * @param fullProductionCode
 * @param showName
 * @param dataLookUp
 * @returns
 */
export const getNextNonEmptyBooking = ({
  index,
  maxDays,
  startDate,
  fullProductionCode,
  showName,
  dataLookUp,
}: {
  index: number;
  maxDays: number;
  startDate: string;
  fullProductionCode: string;
  showName: string;
  dataLookUp: Record<string, ScheduleViewFormatted[]>;
}): ScheduleViewFormatted[] | null => {
  for (let i = index; i < maxDays; i++) {
    const nextDateIncomingFormat = getDateDaysAway(startDate, i);
    const nextKey = getKey({
      FullProductionCode: fullProductionCode,
      ShowName: showName,
      EntryDate: formatDate(nextDateIncomingFormat, 'yyyy-MM-dd'),
    });
    const nextValue = dataLookUp[nextKey];
    if (nextValue?.length) {
      return nextValue;
    }
  }
  return null;
};

/**
 * Check if the entry is of type other day
 * @param entryName
 * @returns
 */
export const isOtherDayType = (entryName: string) =>
  ['Day Off', 'Travel Day', 'Get-In / Fit-Up Day', 'Tech / Dress Day', 'Rehearsal Day', 'Declared Holiday'].includes(
    entryName,
  );

export const checkIfMultipleVenuesOnNextDay = (nextDayData: ScheduleViewFormatted[] = []) => {
  if (!nextDayData?.length) {
    return false;
  }
  return nextDayData.some((x) => x?.VenueId !== nextDayData?.[0]?.VenueId);
};
