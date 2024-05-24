import { startOfWeek, differenceInWeeks, addWeeks, isBefore, isValid } from 'date-fns';
import moment from 'moment';

export const safeDate = (date: Date | string) => {
  if (typeof date === 'string') return new Date(date);
  return date;
};

export const getKey = (date: string) => date.split('T')[0];

export const todayToSimple = () => {
  const date = new Date();
  return date.toDateString();
};

export const dateStringToPerformancePair = (dateString: string) => {
  const datePart = dateString.split('T')[0];
  const timePart = dateString.split('T')[1];

  const defaultDatePart = '1970-01-01';

  return {
    Time: new Date(`${defaultDatePart}T${timePart}Z`),
    Date: new Date(`${datePart}`),
  };
};

// expects a string in DD/MM/YY format
export const simpleToDate = (stringToFormat: string) => {
  const parts = stringToFormat.split('/');
  return new Date(Number(`20${parts[2]}`), Number(Number(parts[0]) - 1), Number(parts[1]));
};

export const dateToSimple = (dateToFormat: Date | string) => {
  if (!dateToFormat) return 'DD/MM/YY';
  const date = safeDate(dateToFormat);
  const options: Intl.DateTimeFormatOptions = {
    year: '2-digit',
    day: '2-digit',
    month: '2-digit',
    timeZone: 'UTC',
  };
  return date.toLocaleDateString('en-GB', options);
};

export const formattedDateWithDay = (dateString: Date | string) => {
  if (!dateString) return '';
  const format = 'DD/MM/YY';
  return moment(dateString).format(format);
};

export const dateToPicker = (dateToFormat: Date | string) => {
  if (!dateToFormat) return '';

  if (typeof dateToFormat === 'object') {
    return dateToFormat.toISOString().slice(0, 10);
  }

  // Handle string values that represent incomplete dates
  if (typeof dateToFormat === 'string') {
    // Basic validation or manipulation if needed
    return dateToFormat;
  }

  return dateToFormat;
};

export const dateTimeToTime = (dateToFormat: string) => {
  return moment(dateToFormat).format('HH:mm');
};

export const toISO = (date: Date) => {
  return date.toISOString();
};

export const getDateDaysAgo = (date, daysToSubtract) => {
  date = new Date(date);
  return moment(date, 'dd/mm/yyyy').subtract(daysToSubtract, 'days');
};

export const getDateDaysInFuture = (date, daysToSubtract) => {
  date = new Date(date);
  return moment(date, 'dd/mm/yyyy').add(daysToSubtract, 'days');
};

export const getWeekDay = (dateToFormat: Date | string) => {
  const date = safeDate(dateToFormat);
  return date.toLocaleDateString('en-US', { weekday: 'long' });
};

export const getWeekDayShort = (dateToFormat: Date | string) => {
  const date = safeDate(dateToFormat);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

export const getWeekDayLong = (dateToFormat: Date | string) => {
  const date = safeDate(dateToFormat);
  return date.toLocaleDateString('en-US', { weekday: 'long' });
};

export const formattedDateWithWeekDay = (dateToFormat: Date | string, weekDayFormat: 'Long' | 'Short') => {
  if (!dateToFormat) return '';
  const shortFormat = 'ddd DD/MM/YY';
  const longFormat = 'dddd DD/MM/YYYY';
  return moment(dateToFormat).format(weekDayFormat === 'Long' ? longFormat : shortFormat);
};

// Broken week number calculation
export const weeks = (showDate: string, firstShowDate: string): number => {
  const date = moment(showDate, 'YYYY-MM-DD');
  const ProductionStartDate = moment(firstShowDate, 'YYYY-MM-DD');
  const diff = moment.duration(ProductionStartDate.diff(date));

  let week = Math.floor(diff.asWeeks());
  if (week >= 0) {
    week = week + 1;
  }

  return week;
};

// Working one. AFAIK
export const calculateWeekNumber = (productionStart: Date, dateToNumber: Date): number => {
  const weekOneStart = startOfWeek(productionStart, { weekStartsOn: 1 });
  let weekNumber = differenceInWeeks(dateToNumber, weekOneStart);

  // Handle the week boundary condition
  const adjustedStartDate = addWeeks(weekOneStart, weekNumber);
  if (isBefore(dateToNumber, adjustedStartDate)) weekNumber -= 1;
  if (isBefore(dateToNumber, weekOneStart)) weekNumber -= 1;

  weekNumber += 1;

  return weekNumber;
};

export const timeNow = () => {
  const today = new Date();
  return today.getHours().toFixed() + ':' + today.getMinutes().toFixed() + ':' + today.getSeconds().toFixed();
};

export const formatTime = (timestamp) => {
  // This will ignre date
  const today = new Date(timestamp);
  // const options = { hours: '2-digit', minutes: '2-digit', seconds: '2-digit' }
  return today.toLocaleTimeString();
};

export const timeFormat = (mins?: number) => {
  if (!mins) return '';
  return `${Math.floor(mins / 60)}:${String(mins % 60).padStart(2, '0')}`;
};

export const formatDateUK = (date) => {
  // This will ignre date
  const today = new Date(date);
  return today.toLocaleDateString('en-GB');
};

export const getMonday = (inputDate) => {
  const currentDateObj = new Date(inputDate);
  currentDateObj.setDate(currentDateObj.getDate() - ((currentDateObj.getDay() + 6) % 7));
  return currentDateObj;
};

export const getSunday = (inputDate) => {
  const currentDateObj = new Date(inputDate);
  currentDateObj.setDate(currentDateObj.getDate() - ((currentDateObj.getDay() + 7) % 7) + 1);
  return currentDateObj;
};

export const quickISO = (DateString: string) => {
  return new Date(DateString);
};

export const formDate = (DateString: string) => {
  const formDateString = DateString.toString();
  return formDateString.substring(0, 10);
};

export const getWeeksBetweenDates = (startDate: string, endDate: string) => {
  const currentSunday = moment.utc(startDate).startOf('isoWeek').subtract(1, 'day').set('hour', 0);
  const end = moment.utc(endDate);
  const weeks = [];

  while (currentSunday.isBefore(end)) {
    const nextMonday = currentSunday.clone().add(1, 'day').set('hour', 0);
    const sundayDate = currentSunday.set('hour', 0).toISOString()?.split('T')?.[0];
    const mondayDate = nextMonday.set('hour', 0).toISOString()?.split('T')?.[0];
    weeks.push({ sundayDate, mondayDate });

    currentSunday.add(7, 'days');
  }

  return weeks;
};

export const getPreviousMonday = (date) => {
  const dayOfWeek = date.getDay();
  const difference = ((dayOfWeek + 6) % 7) + 7; // Calculate the difference to Monday
  const previousMonday = new Date(date);
  previousMonday.setDate(date.getDate() - difference);
  return previousMonday;
};

export const getNextMondayDateString = (date: string) => {
  const inputDate = moment.utc(date);
  if (!inputDate.isValid()) {
    return '';
  }

  const daysUntilNextMonday = (7 - inputDate.day() + 1) % 7;
  const nextMondayDate = inputDate.add(daysUntilNextMonday, 'days');
  const nextMondayDateStr = nextMondayDate.toISOString();
  return nextMondayDateStr;
};

/**
 * Extracts the time (hours and minutes) from a given date and time string in UTC format.
 *
 * @param {string | Date} inputDate - The input date and time string.
 * @returns {string} The formatted time string in 'HH:mm' format, or an empty string if the input is invalid.
 */
export const getTimeFromDateAndTime = (inputDate: string | Date): string => {
  const date = new Date(inputDate);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return ''; // Return an empty string or handle the error as needed
  }

  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
};

export const toSql = (date: string) => {
  return new Date(date).toISOString()?.split?.('T')?.[0];
};

export function getDuration(upTime: string, downTime: string): number {
  if (upTime === '' || downTime === '') {
    return 0;
  }
  const up = new Date(`2023-01-01 ${upTime}`);
  const down = new Date(`2023-01-01 ${downTime}`);
  const diff = down.getTime() - up.getTime();
  return diff;
}

export function formatDuration(
  duration: number,
  options?: {
    h: string;
    m: string;
  },
): string {
  const minutes = Math.floor(duration / 1000 / 60);
  // format minutes to hours and minutes
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours > 0) {
    return `${hours}${options?.h ?? 'h'} ${remainingMinutes}${options?.m ?? 'm'}`;
  } else if (remainingMinutes > 0) {
    return `${remainingMinutes}${options?.m ?? 'm'}`;
  } else {
    return '';
  }
}

export const isValidDateString = (date: string): boolean => {
  const d = new Date(date);
  return d instanceof Date && !isNaN(d.getTime());
};

export const convertLocalDateToUTC = (date: Date) => {
  return new Date(
    Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
    ),
  );
};

export const checkDateOverlap = (start1: Date, end1: Date, start2: Date, end2: Date): boolean => {
  return !((start1 < start2 && end1 < start2) || (start1 > end2 && end2 > end1));
};

export const getArrayOfDatesBetween = (start: string, end: string) => {
  const arr = [];
  if (!isValid(new Date(start)) || !isValid(new Date(end))) {
    return [];
  }
  for (let dt = moment.utc(start); dt <= moment.utc(end); dt = dt.add(1, 'days')) {
    arr.push(dt.toISOString());
  }
  return arr.map(getKey);
};
