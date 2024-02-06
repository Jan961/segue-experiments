import { PerformanceDTO, ProductionDTO } from 'interfaces';
import { VenueState } from 'state/booking/venueState';

class BookingHelper {
  private venueDict: VenueState;
  private performanceDict: Record<number, PerformanceDTO>;
  private productionDict: Record<number, ProductionDTO>;
  constructor({ venueDict, performanceDict, productionDict }) {
    this.venueDict = venueDict;
    this.performanceDict = performanceDict;
    this.productionDict = productionDict;
    this.getBookingDetails = this.getBookingDetails.bind(this);
    this.getInFitUpDetails = this.getInFitUpDetails.bind(this);
    this.getOthersDetails = this.getOthersDetails.bind(this);
    this.getRehearsalDetails = this.getRehearsalDetails.bind(this);
  }

  getBookingDetails(booking) {
    const { VenueId, performanceIds, Notes: note } = booking || {};
    const { Name: venue, Town: town, Seats: capacity, Count: count, Id: venueId } = this.venueDict[VenueId] || {};
    const performanceTimes = performanceIds
      .map((performanceId) => this.performanceDict[performanceId]?.Time?.substring(0, 5))
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
      performanceCount: performanceIds?.length || 0,
    };
  }

  getRehearsalDetails(rehearsal) {
    return {
      Id: rehearsal?.Id,
      town: rehearsal.Town,
    };
  }

  getOthersDetails(others) {
    const { DayTypeName: dayType } = others || {};
    return {
      Id: others?.Id,
      status: others.StatusCode,
      dayType,
    };
  }

  getInFitUpDetails(gifu) {
    const { VenueId } = gifu;
    const venue = this.venueDict[VenueId];
    return {
      Id: gifu?.Id,
      venue: venue.Name,
      town: venue.Town,
    };
  }

  getRangeFromDateBlocks(dateBlocks) {
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

  getProductionByDate(dateBlocks = [], date) {
    const db = dateBlocks?.find((block) => block.StartDate <= date && block.EndDate <= date);
    return this.productionDict?.[db?.ProductionId];
  }
}

export default BookingHelper;
