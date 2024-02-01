import { selector } from 'recoil';
import { rehearsalState } from '../rehearsalState';
import { bookingState } from '../bookingState';
import { getInFitUpState } from '../getInFitUpState';
import { otherState } from '../otherState';
import { venueState } from '../venueState';
import { productionJumpState } from '../productionJumpState';
import { objectify } from 'radash';

const getProductionName = ({ Id, ShowCode, ShowName }: any) => `${ShowCode}${Id} - ${ShowName}`;
const getProductionCode = ({ Id, ShowCode }: any) => `${ShowCode}${Id}`;

export const rowsSelector = selector({
  key: 'rowsSelector',
  get: ({ get }) => {
    const rehearsals = get(rehearsalState);
    const bookings = get(bookingState);
    const getInFitUp = get(getInFitUpState);
    // const performances = get(performanceState);
    const other = get(otherState);
    const venueDict = get(venueState);
    const { productions } = get(productionJumpState);
    const productionDict = objectify(productions, (production) => production.Id);
    const rows: any = [];
    const getBookingDetails = (booking) => {
      const { VenueId, performanceIds, Notes: notes, Seats: capacity } = booking || {};
      const { Name: venueName, Town: venueTown } = venueDict[VenueId] || {};
      return {
        venueName,
        venueTown,
        capacity,
        noOfPerfs: performanceIds?.length || 0,
        notes,
      };
    };
    const getRehearsalDetails = (rehearsal) => {
      return {
        venueTown: rehearsal.Town,
      };
    };
    const getOthersDetails = (others) => {
      return {
        status: others.StatusCode,
      };
    };
    const getInFitUpDetails = (gifu) => {
      const { VenueId } = gifu;
      const venue = venueDict[VenueId];
      return {
        venueName: venue.Name,
        venueTown: venue.Town,
      };
    };
    const addRow = (date: string, type: string, data: any, transformer) => {
      const { ProductionId } = data;
      const production = productionDict[ProductionId] || {};
      const rowData = transformer(data);
      const row = {
        date,
        production: getProductionName(production),
        productionCode: getProductionCode(production),
        productionId: ProductionId,
        dayType: type,
        status: data?.StatusCode,
        ...rowData,
      };
      rows.push(row);
    };
    Object.values(rehearsals).forEach((r) => {
      addRow(r.Date, 'rehearsal', r, getRehearsalDetails);
    });
    Object.values(getInFitUp).forEach((g) => {
      addRow(g.Date, 'gifu', g, getInFitUpDetails);
    });
    Object.values(bookings).forEach((b) => {
      addRow(b.Date, 'booking', b, getBookingDetails);
    });
    Object.values(other).forEach((o) => {
      addRow(o.Date, 'other', o, getOthersDetails);
    });
    return rows;
  },
});
