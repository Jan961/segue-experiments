import {
  BookingDTO,
  DateBlockDTO,
  GetInFitUpDTO,
  OtherDTO,
  PerformanceDTO,
  ProductionDTO,
  RehearsalDTO,
} from 'interfaces';
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
    const { VenueId, PerformanceIds, Notes: note } = booking || {};
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
    };
  }

  getRehearsalDetails(rehearsal: RehearsalDTO) {
    return {
      Id: rehearsal?.Id,
      town: rehearsal.Town,
    };
  }

  getOthersDetails(others: OtherDTO) {
    const { DateTypeName: dayType } = others || {};
    return {
      Id: others?.Id,
      status: others.StatusCode,
      dayType,
    };
  }

  getInFitUpDetails(gifu: GetInFitUpDTO) {
    const { VenueId } = gifu;
    const venue = this.venueDict[VenueId];
    return {
      Id: gifu?.Id,
      venue: venue.Name,
      town: venue.Town,
    };
  }

  getRangeFromDateBlocks(dateBlocks: DateBlockDTO[]): { start: string; end: string } {
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

  getProductionByDate(dateBlocks: DateBlockDTO[] = [], date: string | Date = '') {
    date = new Date(date);
    const db = dateBlocks?.find((block) => new Date(block.StartDate) <= date && new Date(block.EndDate) >= date);
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