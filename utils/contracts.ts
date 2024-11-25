import { contractOptionMapping, contractDepartmentOptions } from 'config/contracts';
import {
  ContractPermissionGroup,
  ContractsDTO,
  DateBlockDTO,
  GetInFitUpDTO,
  OtherDTO,
  PerformanceDTO,
  ProductionDTO,
  RehearsalDTO,
} from 'interfaces';
import { ContractsVenueState } from 'state/contracts/contractsVenueState';

type ContractsHelperArgType = {
  venueDict?: ContractsVenueState;
  performanceDict?: Record<number, PerformanceDTO>;
  productionDict?: Record<number, Partial<ProductionDTO>>;
};

class ContractsHelper {
  private venueDict?: ContractsVenueState;
  private performanceDict?: Record<number, PerformanceDTO>;
  private productionDict?: Record<number, Partial<ProductionDTO>>;
  constructor({ venueDict, performanceDict, productionDict }: ContractsHelperArgType) {
    this.venueDict = venueDict;
    this.performanceDict = performanceDict;
    this.productionDict = productionDict;
    this.getContractsDetails = this.getContractsDetails.bind(this);
    this.getOthersDetails = this.getOthersDetails.bind(this);
    this.getInFitUpDetails = this.getInFitUpDetails.bind(this);
    this.getRehearsalDetails = this.getRehearsalDetails.bind(this);
  }

  getContractsDetails(booking: ContractsDTO) {
    const { VenueId, PerformanceIds, Notes: note, RunTag: runTag, PencilNum } = booking || {};
    const {
      Name: venue,
      Town: town,
      Seats: capacity,
      Count: count,
      Id: venueId,
      CurrencyCode,
    } = this.venueDict[VenueId] || {};
    const PerformanceTimes = PerformanceIds.map(
      (performanceId) =>
        `${this.performanceDict[performanceId]?.Time?.substring(0, 5) ?? ''}? ${this.performanceDict[performanceId]
          ?.Date}`,
    ).filter((time) => time);

    return {
      Id: booking?.Id,
      count,
      venueId,
      venue,
      town,
      capacity,
      note,
      PerformanceTimes,
      performanceCount: PerformanceIds?.length || 0,
      runTag,
      pencilNo: PencilNum,
      isBooking: true,
      CurrencyCode,
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

export const getContractDropdownOptions = (permissions: ContractPermissionGroup) => {
  return Object.entries(contractOptionMapping)
    .filter(([key]) => permissions[key])
    .map(([, text]) => contractDepartmentOptions.find((x) => x.text === text))
    .filter(Boolean);
};

export default ContractsHelper;
