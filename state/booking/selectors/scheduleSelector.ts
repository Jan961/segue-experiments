import { selector } from 'recoil';
import { bookingState } from 'state/booking/bookingState';
import { dateBlockState } from 'state/booking/dateBlockState';
import { getInFitUpState } from 'state/booking/getInFitUpState';
import { rehearsalState } from 'state/booking/rehearsalState';
import { performanceState } from '../performanceState';
import { otherState } from '../otherState';
import { getArrayOfDatesBetween } from 'services/dateService';

const getKey = (date: string) => date.split('T')[0];

export interface PerformanceViewModel {
  BookingId: number;
  Id: number;
  Date: string;
}

export interface DateViewModel {
  Date: string;
  RehearsalIds: number[];
  GetInFitUpIds: number[];
  PerformanceIds: number[];
  OtherIds: number[];
  BookingIds: number[];
}

export interface ScheduleSectionViewModel {
  Dates: DateViewModel[];
  Name: string;
  Id: number;
}

export interface ScheduleViewModel {
  Sections: ScheduleSectionViewModel[];
}

export const scheduleSelector = selector({
  key: 'scheduleSelector',
  get: ({ get }) => {
    const rehearsals = get(rehearsalState);
    const bookings = get(bookingState);
    const getInFitUp = get(getInFitUpState);
    const performances = get(performanceState);
    const other = get(otherState);
    // This one is an array (won't change on booking page)
    const dateBlocks = get(dateBlockState);

    const getDefaultDate = (key: string): DateViewModel => ({
      Date: key,
      BookingIds: [],
      RehearsalIds: [],
      GetInFitUpIds: [],
      PerformanceIds: [],
      OtherIds: [],
    });

    const dates: Record<string, any> = {};

    const addDate = (date: string, property: string, data: number | PerformanceViewModel) => {
      const key = getKey(date);
      if (!dates[key]) dates[key] = getDefaultDate(key);
      dates[key][property].push(data);
    };

    Object.values(rehearsals).forEach((r) => addDate(r.Date, 'RehearsalIds', r.Id));
    Object.values(getInFitUp).forEach((g) => addDate(g.Date, 'GetInFitUpIds', g.Id));
    Object.values(bookings).forEach((b) => addDate(b.Date, 'BookingIds', b.Id));
    Object.values(other).forEach((o) => addDate(o.Date, 'OtherIds', o.Id));
    Object.values(performances).forEach((p) => {
      addDate(p.Date, 'PerformanceIds', p.Id);
      addDate(p.Date, 'BookingIds', p.BookingId);
    });

    return {
      Sections: dateBlocks.map((db) => ({
        Id: db.Id,
        Name: db.Name,
        Dates: getArrayOfDatesBetween(db.StartDate, db.EndDate).map((date: string) =>
          dates[date] ? dates[date] : getDefaultDate(date),
        ),
      })),
    };
  },
});
