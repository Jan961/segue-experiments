import { selector } from 'recoil';
import { rehearsalState } from '../rehearsalState';
import { bookingState } from '../bookingState';
import { getInFitUpState } from '../getInFitUpState';
import { otherState } from '../otherState';
import { venueState } from '../venueState';
import { productionJumpState } from '../productionJumpState';
import { objectify } from 'radash';
import moment from 'moment';
import { bookingStatusMap } from 'config/bookings';
import { calculateWeekNumber } from 'services/dateService';
import { performanceState } from '../performanceState';

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
    const { productions } = get(productionJumpState);
    const productionDict = objectify(productions, (production) => production.Id);
    const rows: any = [];
    const getBookingDetails = (booking) => {
      const { VenueId, performanceIds, Notes: note } = booking || {};
      const { Name: venue, Town: town, Seats: capacity } = venueDict[VenueId] || {};
      const performanceTimes = performanceIds
        .map((performanceId) => performanceDict[performanceId]?.Time?.substring(0, 5))
        .filter((time) => time)
        .join('; ');
      return {
        venue,
        town,
        capacity,
        note,
        performanceTimes,
        performanceCount: performanceIds?.length || 0,
      };
    };
    const getRehearsalDetails = (rehearsal) => {
      return {
        town: rehearsal.Town,
      };
    };
    const getOthersDetails = (others) => {
      const { DayTypeName: dayType } = others || {};
      return {
        status: others.StatusCode,
        dayType,
      };
    };
    const getInFitUpDetails = (gifu) => {
      const { VenueId } = gifu;
      const venue = venueDict[VenueId];
      return {
        venue: venue.Name,
        town: venue.Town,
      };
    };
    const addRow = (date: string, type: string, data: any, transformer) => {
      const { ProductionId, PrimaryDateBlock } = data;
      const production = productionDict[ProductionId] || {};
      const rowData = transformer(data);
      const week = calculateWeekNumber(new Date(PrimaryDateBlock?.StartDate), new Date(date));
      const row = {
        week,
        dateTime: date,
        date: date ? moment(date).format('ddd DD/MM/YY') : '',
        productionName: getProductionName(production),
        production: getProductionCode(production),
        productionId: ProductionId,
        dayType: type,
        bookingStatus: bookingStatusMap[data?.StatusCode] || '',
        status: data?.StatusCode,
        ...rowData,
      };
      rows.push(row);
    };
    Object.values(rehearsals).forEach((r) => {
      addRow(r.Date, 'Rehearsal', r, getRehearsalDetails);
    });
    Object.values(getInFitUp).forEach((g) => {
      addRow(g.Date, 'Get-in, Fit-Up', g, getInFitUpDetails);
    });
    Object.values(bookings).forEach((b) => {
      addRow(b.Date, 'Performance', b, getBookingDetails);
    });
    Object.values(other).forEach((o) => {
      addRow(o.Date, o?.DateTypeName || 'Other', o, getOthersDetails);
    });
    return rows;
  },
});
