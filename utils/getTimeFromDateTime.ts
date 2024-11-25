import { newDate } from 'services/dateService';
import { NewPerformance } from '../services/bookingService';
export const checkDateValid = (dateObj: Date) => {
  return dateObj && !isNaN(dateObj.getTime()) ? dateObj : null;
};

export const getPerformanceTime = (performanceObj: NewPerformance): Date => {
  return performanceObj.Time ? newDate(performanceObj.Time) : null;
};
