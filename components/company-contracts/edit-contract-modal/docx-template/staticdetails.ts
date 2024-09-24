import { IScheduleDay } from 'components/contracts/types';
import { ProductionDTO } from 'interfaces';

export const getStaticDetailsTags = (productionInfo: Partial<ProductionDTO>, productionSchedule: IScheduleDay[]) => {
  const helpers = createHelperFunctions(productionInfo, productionSchedule);

  return {
    FIRSTPERFORMANCEDATE: helpers.getFirstPerfDate(),
    DATEOFDOCCREATION: helpers.getDateOfDocumentCreation(),
    SHOWNAME: helpers.getShowName(),
    FIRSTDAYOFWORK: helpers.getFirstDayOfWork(),
    CONTRACTCURRENCY: helpers.getContractCurrency(),
    CONTRACTENDDATE: helpers.getContractEndDate(),
    PRODCOMPANYNAME: helpers.getProductionCompanyName(),
    REHEARSALTOWN: helpers.getRehearsalTown(),
    REHEARSALVENUE: helpers.getRehearsalVenue(),
    REHEARSALVENUENOTES: helpers.getRehearsalVenueNotes(),
    ALLPERFORMANCESATSAMEVENUE: helpers.getAreAllPerformancesAtSameVenue(),
    SINGLEPERFORMANCEVENUE: helpers.getSinglePerformanceVenue(),
  };
};

const createHelperFunctions = (productionInfo: Partial<ProductionDTO>, productionSchedule: IScheduleDay[]) => {
  return {
    getDateOfDocumentCreation: () => {
      return new Date().toISOString();
    },

    getFirstPerfDate: () => {
      const firstPerformance = productionSchedule.find((day) => !day.isCancelled && day.type === 'Performance');
      return firstPerformance?.date || '{ FIRST PERFORMANCE DATE UNAVAILABLE }';
    },

    getShowName: () => {
      return productionInfo?.ShowName || '{ SHOW NAME UNAVAILABLE }';
    },

    // Is this just the ShowCode + ShowName?
    getProductionName: () => {
      const showCode = productionInfo?.ShowCode;
      const showName = productionInfo?.ShowName;
      if (!showCode || !showName) {
        return '{ PRODUCTION NAME UNAVAILABLE }';
      } else {
        return `${showCode} ${showName}`;
      }
    },

    getFirstDayOfWork: () => {
      const firstDay = productionSchedule.find((day) => !day.isOtherDay && !day.isCancelled);
      return firstDay ? firstDay.date : '{ FIRST DAY OF WORK UNAVAILABLE }';
    },

    getContractCurrency: () => {
      return 'USD';
    },

    // Is this the Last Day of the Production? The Last Performance? Need to clarify
    getContractEndDate: () => {
      return '12/31/2024';
    },

    getProductionCompanyName: () => {
      return 'Production Company Name';
    },

    getRehearsalTown: () => {
      return 'Rehearsal Town';
    },

    getRehearsalVenue: () => {
      return 'Rehearsal Venue';
    },

    getRehearsalVenueNotes: () => {
      return 'Venue Notes';
    },

    getAreAllPerformancesAtSameVenue: () => {
      const venues = productionSchedule.filter((day) => day.type === 'Performance').map((day) => day.venue);
      const uniqueVenues = new Set(venues);
      return uniqueVenues.size === 1;
    },

    getSinglePerformanceVenue: () => {
      return 'Single Venue';
    },
  };
};
