import { selector } from 'recoil';
import { rehearsalState } from '../rehearsalState';
import { bookingState } from '../bookingState';
import { dateTypeState } from '../dateTypeState';
import { getInFitUpState } from '../getInFitUpState';
import { otherState } from '../otherState';
import { venueState } from '../venueState';
import { productionJumpState } from '../productionJumpState';
import { objectify } from 'radash';
import { bookingRow, bookingStatusMap } from 'config/bookings';
import { calculateWeekNumber, getKey, getArrayOfDatesBetween, newDate, formatDate } from 'services/dateService';
import { performanceState } from '../performanceState';
import BookingHelper from 'utils/booking';
import { dateBlockState } from '../dateBlockState';
import { DAY_TYPE_FILTERS } from 'components/bookings/utils';
import { distanceState } from '../distanceState';

const getProductionName = ({ Id, ShowCode, ShowName }: any) => `${ShowCode}${Id} - ${ShowName}`;
const getProductionCode = ({ ShowCode, Code }: any) => `${ShowCode}${Code}`;

export const rowsSelector = selector({
  key: 'rowsSelector',
  get: ({ get }) => {
    const rehearsals = get(rehearsalState);
    const bookings = get(bookingState);
    const getInFitUp = get(getInFitUpState);
    const performanceDict = get(performanceState);
    const other = get(otherState);
    const venueDict = get(venueState);
    const dayTypes = get(dateTypeState);
    const { productions } = get(productionJumpState);
    const productionDict = objectify(productions, (production) => production.Id);
    const dateBlocks = get(dateBlockState);
    const helper = new BookingHelper({ performanceDict, venueDict, productionDict });
    const distance = get(distanceState);
    const getDistance = (productionId, dateTime, venueId) => {
      const productionDistance = distance?.[productionId] || {};
      const { option = [] } = productionDistance?.stops?.find((x) => x.Date === dateTime) || {};
      const venue = option?.find((x) => x.VenueId === venueId);
      return {
        miles: venue?.Miles,
        travelTime: venue?.Mins,
      };
    };
    const { start, end } = helper.getRangeFromDateBlocks(dateBlocks);
    const rows: any = [];
    const bookedDates: string[] = [];
    const addRow = (date: string, type: string, data: any, transformer) => {
      const { ProductionId, PrimaryDateBlock } = data;
      const production = productionDict[ProductionId] || {};
      const rowData = transformer(data);
      const week = calculateWeekNumber(newDate(PrimaryDateBlock?.StartDate), newDate(date));
      const otherDayType = dayTypes.find(({ Id }) => Id === data.DateTypeId)?.Name;
      const getValueForDayType = (value, type) => {
        if (!value) {
          if (type === 'Other') {
            return otherDayType;
          }
          return DAY_TYPE_FILTERS.includes(type) ? type : value;
        }
        return value;
      };
      const { miles = '', travelTime = '' } = getDistance(ProductionId, date, data.VenueId);

      const row = {
        ...rowData,
        week,
        dateTime: date,
        date: date ? formatDate(date, 'EEE dd/MM/yy') : '',
        productionName: getProductionName(production),
        production: getProductionCode(production),
        productionId: ProductionId,
        dayType: type === 'Other' ? otherDayType : type,
        bookingStatus: bookingStatusMap[data?.StatusCode] || '',
        status: data?.StatusCode,
        venue: getValueForDayType(rowData.venue, type),
        town: getValueForDayType(rowData.town, type),
        miles,
        travelTime,
      };

      rows.push(row);
    };
    Object.values(rehearsals).forEach((r) => {
      bookedDates.push(getKey(r.Date));
      addRow(r.Date, 'Rehearsal', r, helper.getRehearsalDetails);
    });
    Object.values(getInFitUp).forEach((g) => {
      bookedDates.push(getKey(g.Date));
      addRow(g.Date, 'Get in / Fit Up', g, helper.getInFitUpDetails);
    });
    Object.values(bookings).forEach((b) => {
      const performancesGroup = b.PerformanceIds.reduce((performancesByDate, performanceId) => {
        const performance = performanceDict[performanceId];
        const performanceDate = new Date(getKey(performance.Date)).toISOString();
        if (performancesByDate[performanceDate]) {
          performancesByDate[performanceDate].push(performanceId);
        } else {
          performancesByDate[performanceDate] = [performanceId];
        }
        return performancesByDate;
      }, {});
      Object.keys(performancesGroup).forEach((date) => {
        bookedDates.push(getKey(date));
        addRow(date, 'Performance', { ...b, PerformanceIds: performancesGroup[date] }, helper.getBookingDetails);
      });
    });
    Object.values(other).forEach((o) => {
      bookedDates.push(getKey(o.Date));
      addRow(o.Date, o?.DateTypeName || 'Other', o, helper.getOthersDetails);
    });
    const allDates = getArrayOfDatesBetween(start, end);
    for (const date of allDates) {
      if (!bookedDates.includes(date)) {
        const production = helper.getProductionByDate(dateBlocks, date);
        if (!production) {
          continue;
        }
        const week = calculateWeekNumber(newDate(production?.StartDate), newDate(date)) || '';
        const emptyRow = {
          ...bookingRow,
          week,
          date: formatDate(date, 'EEE dd/MM/yy'),
          dateTime: newDate(date).toISOString(),
          production: production ? getProductionCode(production) : '',
          productionId: production?.Id,
          productionCode: production?.Code,
        };
        rows.push(emptyRow);
      }
    }
    return { rows, scheduleStart: start, scheduleEnd: end };
  },
});
