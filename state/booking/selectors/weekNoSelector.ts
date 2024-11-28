import { selector } from 'recoil';
import { sort } from 'radash';
import { dateBlockState } from '../dateBlockState';
import { parseISO } from 'date-fns';
import { sortedBookingSelector } from './sortedBookingSelector';
import { calculateWeekNumber, getArrayOfDatesBetween } from 'services/dateService';

export const weekNoSelector = selector({
  key: 'weekNoSelector',
  get: ({ get }) => {
    const dateBlocks = get(dateBlockState);
    const sorted = get(sortedBookingSelector);
    const productionStart = sorted[0]?.Date;
    const start = sort(dateBlocks, (d) => Date.parse(d.StartDate))[0]?.StartDate;
    const end = sort(dateBlocks, (d) => Date.parse(d.EndDate)).reverse()[0]?.EndDate;

    if (!productionStart || !start || !end) return {};

    // Get all dates that need to be looked up
    const dates = getArrayOfDatesBetween(start, end);

    const result = {};

    const productionStartDate = parseISO(productionStart);

    for (const date of dates) result[date] = calculateWeekNumber(productionStartDate.getTime(), date);

    return result;
  },
});
