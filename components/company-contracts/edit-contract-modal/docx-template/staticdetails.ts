import { IScheduleDay } from 'components/contracts/types';
import { ProductionDTO } from 'interfaces';

export const getStaticDetailsTags = (productionInfo: Partial<ProductionDTO>, productionSchedule: IScheduleDay[]) => {
  const helpers = createHelperFunctions(productionInfo, productionSchedule);

  return {
    FIRSTPERFORMANCEDATE: helpers.getFirstPerfDate(),
    DATEOFDOCCREATION: helpers.getDateOfDocumentCreation(),
    SHOWNAME: helpers.getShowName(),
    PRODUCTIONNAME: helpers.getProductionName(),
    PRODCOMPANYNAME: helpers.getProductionCompanyName(),
    ALLPERFORMANCESATSAMEVENUE: helpers.getAreAllPerformancesAtSameVenue(),
    SINGLEPERFORMANCEVENUE: helpers.getSinglePerformanceVenue(),
    PRODCOMPANYLOGO: helpers.getProdCompanyLogo(),
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

    getProductionCompanyName: () => {
      return productionInfo?.ProductionCompany?.ProdCoName || '{ PRODUCTION COMPANY NAME UNAVAILABLE }';
    },

    getProdCompanyLogo: () => {
      return '';
    },

    getAreAllPerformancesAtSameVenue: () => {
      const venues = productionSchedule.filter((day) => day.type === 'Performance').map((day) => day.venue);
      const uniqueVenues = new Set(venues);
      return uniqueVenues.size === 1;
    },

    getSinglePerformanceVenue: () => {
      const venues = productionSchedule.filter((day) => day.type === 'Performance').map((day) => day.venue);
      const uniqueVenue = new Set(venues);

      const result = uniqueVenue.size === 1 ? uniqueVenue.values().next().value : '{ NO SINGLE VENUE }';
      return result;
    },
  };
};
