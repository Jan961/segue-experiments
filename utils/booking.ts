import { UTCDate } from '@date-fns/utc';
import {
  BookingDTO,
  DateBlockDTO,
  GetInFitUpDTO,
  OtherDTO,
  PerformanceDTO,
  ProductionDTO,
  RehearsalDTO,
} from 'interfaces';
import { newDate, safeDate } from 'services/dateService';
import { VenueState } from 'state/booking/venueState';

type BookingHelperArgType = {
  venueDict?: VenueState;
  performanceDict?: Record<number, PerformanceDTO>;
  productionDict?: Record<number, Partial<ProductionDTO>>;
};

class BookingHelper {
  private venueDict?: VenueState;
  private performanceDict?: Record<number, PerformanceDTO>;
  private productionDict?: Record<number, Partial<ProductionDTO>>;
  constructor({ venueDict, performanceDict, productionDict }: BookingHelperArgType) {
    this.venueDict = venueDict;
    this.performanceDict = performanceDict;
    this.productionDict = productionDict;
    this.getBookingDetails = this.getBookingDetails.bind(this);
    this.getInFitUpDetails = this.getInFitUpDetails.bind(this);
    this.getOthersDetails = this.getOthersDetails.bind(this);
    this.getRehearsalDetails = this.getRehearsalDetails.bind(this);
  }

  getBookingDetails(booking: BookingDTO) {
    const { VenueId, PerformanceIds, Notes: note, RunTag: runTag, PencilNum } = booking || {};
    const { Name: venue, Town: town, Seats: capacity, Count: count, Id: venueId } = this.venueDict[VenueId] || {};
    const performanceTimes = PerformanceIds.map(
      (performanceId) => this.performanceDict[performanceId]?.Time?.substring(0, 5),
    )
      .filter((time) => time)
      .join('; ');
    return {
      Id: booking?.Id,
      count,
      venueId,
      venue,
      town,
      capacity,
      note,
      performanceTimes,
      performanceCount: PerformanceIds?.length || 0,
      runTag,
      pencilNo: PencilNum,
      isBooking: true,
    };
  }

  getRehearsalDetails(rehearsal: RehearsalDTO) {
    const { Id, VenueId, RunTag: runTag, PencilNum, Notes } = rehearsal;
    const { Name: venue, Town: town, Seats: capacity, Count: count, Id: venueId } = this.venueDict[VenueId] || {};
    return {
      Id,
      town: town || rehearsal.Town,
      venue,
      capacity,
      count,
      venueId,
      runTag,
      pencilNo: PencilNum,
      note: Notes,
      isRehearsal: true,
    };
  }

  getOthersDetails(others: OtherDTO) {
    const { DateTypeName: dayType, RunTag: runTag, PencilNum, Notes } = others || {};
    return {
      Id: others?.Id,
      status: others.StatusCode,
      dayType,
      runTag,
      pencilNo: PencilNum,
      note: Notes,
    };
  }

  getInFitUpDetails(gifu: GetInFitUpDTO) {
    const { VenueId, RunTag: runTag, PencilNum, Notes } = gifu;
    const gifuDetails = {
      Id: gifu?.Id,
      pencilNo: PencilNum,
      note: Notes,
      runTag,
      venue: '',
      town: '',
      venueId: null,
      isGetInFitUp: true,
    };
    if (VenueId) {
      const venue = this.venueDict[VenueId];
      gifuDetails.venue = venue.Name;
      gifuDetails.town = venue.Town;
      gifuDetails.venueId = VenueId;
    }
    return gifuDetails;
  }

  getRangeFromDateBlocks(dateBlocks: Partial<DateBlockDTO>[]): { start: string; end: string } {
    let minStartDate = dateBlocks?.[0]?.StartDate;
    let maxEndDate = dateBlocks?.[0]?.EndDate;
    for (const dateBlock of dateBlocks) {
      if (dateBlock.StartDate < minStartDate) {
        minStartDate = dateBlock.StartDate;
      }
      if (dateBlock.EndDate > maxEndDate) {
        maxEndDate = dateBlock.EndDate;
      }
    }
    return { start: minStartDate, end: maxEndDate };
  }

  getProductionByDate(dateBlocks: DateBlockDTO[] = [], date: string | UTCDate = '') {
    date = safeDate(date);
    const db = dateBlocks?.find((block) => newDate(block.StartDate) <= date && newDate(block.EndDate) >= date);
    return this.productionDict?.[db?.ProductionId];
  }
}

export const getArchivedProductionIds = (productions: Partial<ProductionDTO>[]) => {
  return productions.reduce((archivedList, production) => {
    if (production.IsArchived) {
      archivedList.push(production.Id);
    }
    return archivedList;
  }, []);
};

export const formatMinutes = (minutes: number) => {
  if (!minutes) {
    return '';
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours ? hours + ' hr ' : ''} ${remainingMinutes ? remainingMinutes + ' min' : ''}`;
};

export default BookingHelper;
