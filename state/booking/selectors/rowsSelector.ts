import { selector } from 'recoil';
import { rehearsalState } from '../rehearsalState';
import { bookingState } from '../bookingState';
import { getInFitUpState } from '../getInFitUpState';
import { otherState } from '../otherState';
import { venueState } from '../venueState';
import { productionJumpState } from '../productionJumpState';
import { objectify } from 'radash';
import moment from 'moment';
import { bookingRow, bookingStatusMap } from 'config/bookings';
import { calculateWeekNumber, getKey } from 'services/dateService';
import { performanceState } from '../performanceState';
import BookingHelper from 'utils/booking';
import { dateBlockState } from '../dateBlockState';
import { getArrayOfDatesBetween } from 'utils/getDatesBetween';

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
    const dateBlocks = get(dateBlockState);
    const helper = new BookingHelper({ performanceDict, venueDict, productionDict });
    const { start, end } = helper.getRangeFromDateBlocks(dateBlocks);
    const rows: any = [];
    const bookedDates: string[] = [];
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
      bookedDates.push(getKey(r.Date));
      addRow(r.Date, 'Rehearsal', r, helper.getRehearsalDetails);
    });
    Object.values(getInFitUp).forEach((g) => {
      bookedDates.push(getKey(g.Date));
      addRow(g.Date, 'Get-in, Fit-Up', g, helper.getInFitUpDetails);
    });
    Object.values(bookings).forEach((b) => {
      bookedDates.push(getKey(b.Date));
      addRow(b.Date, 'Performance', b, helper.getBookingDetails);
    });
    Object.values(other).forEach((o) => {
      bookedDates.push(getKey(o.Date));
      addRow(o.Date, o?.DateTypeName || 'Other', o, helper.getOthersDetails);
    });
    const allDates = getArrayOfDatesBetween(start, end);
    for (const date of allDates) {
      if (!bookedDates.includes(date)) {
        const production = helper.getProductionByDate(dateBlocks, date);
        rows.push({
          ...bookingRow,
          date: moment(date).format('ddd DD/MM/YY'),
          dateTime: new Date(date).toISOString(),
          production: production ? getProductionCode(production) : '',
          productionId: production?.Id,
          productionCode: production?.Code,
        });
      }
    }
    return rows;
  },
});
