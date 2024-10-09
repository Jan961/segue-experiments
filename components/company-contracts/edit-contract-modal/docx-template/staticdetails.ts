import { IScheduleDay } from 'components/contracts/types';
import { dateToSimple } from 'services/dateService';
import { ProductionDTO } from 'interfaces';

export const getStaticDetailsTags = (productionInfo: Partial<ProductionDTO>, productionSchedule: IScheduleDay[]) => {
  const helpers = createHelperFunctions(productionInfo, productionSchedule);

  // Tags
  return {
    FIRSTPERFORMANCEDATE: helpers.getFirstPerfDate(),
    DATEOFDOCCREATION: helpers.getDateOfDocumentCreation(),
    SHOWNAME: helpers.getShowName(),
    PRODUCTIONNAME: helpers.getProductionName(),
    PRODCOMPANYNAME: helpers.getProductionCompanyName(),
    ALLPERFORMANCESATSAMEVENUE: helpers.getAreAllPerformancesAtSameVenue(),
    SINGLEPERFORMANCEVENUE: helpers.getSinglePerformanceVenue(),
    PRODCOMPANYLOGO: helpers.getProdCompanyLogo(),
    PERFORMANCETABLE: helpers.getPerformanceTable(),
    PRODCOMPANYADDRESS: helpers.getProductionCompanyAddress(),
  };
};

const createHelperFunctions = (productionInfo: Partial<ProductionDTO>, productionSchedule: IScheduleDay[]) => {
  return {
    getDateOfDocumentCreation: () => {
      return dateToSimple(new Date());
    },

    getFirstPerfDate: () => {
      const firstPerformance = productionSchedule.find((day) => !day.isCancelled && day.type === 'Performance');
      return firstPerformance?.date || 'FIRSTPERFORMANCEDATE';
    },

    getShowName: () => {
      return productionInfo?.ShowName || 'SHOWNAME';
    },

    // Is this just the ShowCode + ShowName?
    getProductionName: () => {
      const showCode = productionInfo?.ShowCode;
      const showName = productionInfo?.ShowName;
      if (!showCode || !showName) {
        return 'PRODUCTIONNAME';
      } else {
        return `${showCode} ${showName}`;
      }
    },

    getProductionCompanyName: () => {
      return productionInfo?.ProductionCompany?.ProdCoName || 'PRODCOMPANYNAME';
    },

    // TODO
    getProductionCompanyAddress: () => {
      return '';
    },

    // TODO
    getProdCompanyLogo: () => {
      return '';
    },

    getPerformanceTable: () => {
      return productionSchedule
        .filter((item) => item.type === 'Performance')
        .map((row) => ({
          Day: row.day,
          Date: row.date,
          Week: row.week,
          Venue: row.venue,
          NumPerfsPerDay: row.performancesPerDay,
          Perf1Time: row.performance1,
          Perf2Time: row.performance2,
        }));
    },

    getAreAllPerformancesAtSameVenue: () => {
      const venues = productionSchedule.filter((day) => day.type === 'Performance').map((day) => day.venue);
      const uniqueVenues = new Set(venues);
      return uniqueVenues.size === 1;
    },

    getSinglePerformanceVenue: () => {
      const venues = productionSchedule.filter((day) => day.type === 'Performance').map((day) => day.venue);
      const uniqueVenue = new Set(venues);

      const result = uniqueVenue.size === 1 ? uniqueVenue.values().next().value : 'SINGLEPERFORMANCEVENUE';
      return result;
    },
  };
};
