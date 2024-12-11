import { newDate } from 'services/dateService';
import { NewPerformance } from '../services/bookingService';
import { UTCDate } from '@date-fns/utc';
import { isValid } from 'date-fns';
export const checkDateValid = (dateObj: Date) => {
  return dateObj && !isNaN(dateObj.getTime()) ? dateObj : null;
};

export const getPerformanceTime = (performanceObj: NewPerformance): UTCDate => {
  if (performanceObj.Time) {
    const date = newDate(performanceObj.Time);
    return isValid(date) ? date : null;
  } else {
    return null;
  }
};
