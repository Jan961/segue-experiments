import { IScheduleDay } from 'components/contracts/types';

export const getStaticDetailsTags = (productionSchedule: IScheduleDay[]) => {
  const helpers = createHelperFunctions(productionSchedule);

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

const createHelperFunctions = (productionSchedule: IScheduleDay[]) => {
  return {
    getDateOfDocumentCreation: () => {
      return new Date().toISOString();
    },

    getFirstPerfDate: () => {
      const firstPerformance = productionSchedule.find((day) => !day.isCancelled && day.type === 'Performance');
      return firstPerformance?.date || 'FIRST PERFORMANCE DATE UNAVAILABLE';
    },

    getShowName: () => {
      return 'Show';
    },

    getFirstDayOfWork: () => {
      return '01/01/2024';
    },

    getContractCurrency: () => {
      return 'USD';
    },

    getContractEndDate: () => {
      return '12/31/2024'; // Example
    },

    getProductionCompanyName: () => {
      return 'Production Company Name'; // Example
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
      return true; // Example
    },

    getSinglePerformanceVenue: () => {
      return 'Single Venue';
    },
  };
};
