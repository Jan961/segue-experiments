import {
  startOfWeek,
  differenceInWeeks,
  addWeeks,
  isBefore,
  isValid,
  format,
  parseISO,
  isSameDay,
  isSameWeek,
  set,
  addMinutes,
} from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import moment from 'moment';

// regex for dd/mm/yy
export const DATE_PATTERN = /(\d{2}\/\d{2}\/\d{2})/;

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
  if (!stringToFormat) return stringToFormat;
  const parts = stringToFormat?.split?.('/');
  return new Date(Number(`20${parts[2]}`), Number(Number(parts[0]) - 1), Number(parts[1]));
};

export const simpleToDateDMY = (dateStr: string) => {
  const [day, month, year] = dateStr.split('/').map(Number);
  return new Date(year + 2000, month - 1, day);
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
  const date = toZonedTime(dateToFormat, 'UTC');
  return format(date, 'HH:mm');
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

export const getShortWeekFormat = (dateToFormat: Date | string) => {
  const weekdayName = moment(dateToFormat).format('ddd');
  return weekdayName;
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
  console.log(productionStart, dateToNumber);
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

export const addOneMonth = (date: Date) => {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + 1);
  return newDate;
};

export const timeFormat = (mins?: number) => {
  if (!mins) return '';
  return `${Math.floor(mins / 60)}:${String(mins % 60).padStart(2, '0')}`;
};

export const formatDateUK = (date) => {
  const today = new Date(date);
  return today.toLocaleDateString('en-GB');
};

export const formatShortDateUK = (date) => {
  return format(new Date(date), 'dd/MM/yy');
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

export const isValidDate = (date?: Date | string | number | null) => {
  if (date === null || typeof date === 'boolean') return false;
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

/**
 *
 * @param {Date} inputDate // the date to add/subtract from
 * @param {number} duration // number of days to add/subtract
 * @param {boolean} add // controls whether days are added or subtracted - if true days are added
 * @returns
 *
 * This function is used to add / subtract days from thr supplied starting date
 *
 */
export function addDurationToDate(inputDate: Date, duration: number, add: boolean) {
  const startingDate = new Date(inputDate.getTime());
  if (add) {
    startingDate.setDate(startingDate.getDate() + duration);
  } else {
    startingDate.setDate(startingDate.getDate() - duration);
  }
  return startingDate;
}

export const formatDateWithTimezoneOffset = ({
  date,
  dateFormat = 'DD/MM/YY',
  timezoneOffset,
}: {
  date: string | Date;
  dateFormat?: string;
  timezoneOffset: number;
}) => {
  if (typeof date === 'string' || !date) {
    date = new Date(date);
  }
  return moment(date).utcOffset(-timezoneOffset).format(dateFormat);
};

/**
 *
 * Used to apply the timezone offset to the date supplied and return it in the same format
 *
 * @param date // date in which the offset should be applied to
 * @returns // date in JS date format
 */
export const getDateWithOffset = (date: Date) => {
  const timezoneOffset = getTimezonOffset();
  const dateWithOffset = addMinutes(date, -timezoneOffset);

  return dateWithOffset;
};

export const convertTimeToTodayDateFormat = (time: string) => {
  const today = new Date();
  const [hours, minutes] = time.split(':').map(Number);

  const updatedDate = set(today, { hours, minutes, seconds: 0, milliseconds: 0 });
  return updatedDate;
};

export const dateToTimeString = (dateStr) => {
  const date = moment(dateStr);
  return date.format('HH:mm');
};

export const getTimezonOffset = () => {
  return new Date().getTimezoneOffset();
};

/**
 * Formats a date according to the specified format.
 *
 * @param {Date | number | string} date - The date to format.
 * @param {string} dateFormat - The format string.
 * @returns {string} The formatted date.
 */
export const formatDate = (date: Date | number | string, dateFormat: string): string => {
  let parsedDate: number | Date;

  if (date instanceof Date) {
    // If date is already a Date object, use it directly
    parsedDate = date;
  } else if (typeof date === 'number') {
    // If date is a timestamp, convert it to a Date object
    parsedDate = new Date(date);
  } else if (typeof date === 'string') {
    // If date is a string, try to parse it as an ISO string first
    parsedDate = parseISO(date);

    // If parsing as ISO fails, try to parse it using the default parser
    if (!isValid(parsedDate)) {
      parsedDate = new Date(date);
    }
  } else {
    return '';
  }

  if (!isValid(parsedDate)) {
    return '';
  }

  return format(parsedDate, dateFormat);
};

/**
 * Convert a date or time to UTC and format it to 'HH:mm'.
 *
 * @param {Date | number | string} time - The time to format.
 * @returns {string} The formatted time in 'HH:mm' UTC.
 */
export const formatUtcTime = (time) => {
  // Convert time to a Date object
  const date = new Date(time);

  // Get the hours and minutes in UTC
  const utcHours = date.getUTCHours();
  const utcMinutes = date.getUTCMinutes();

  // Format the UTC time as 'HH:mm'
  return `${String(utcHours).padStart(2, '0')}:${String(utcMinutes).padStart(2, '0')}`;
};

/**
 * Converts the input (Date, number, or string) to a Date object.
 * Returns null if the input is invalid.
 *
 * @param {Date | number | string} date - The date input to convert.
 * @returns {Date | null} The corresponding Date object or null if the input is invalid.
 */
export const getDateObject = (date: Date | number | string): Date | null => {
  if (date instanceof Date) {
    // If the input is already a Date object, return it
    return date;
  } else if (typeof date === 'number') {
    // If the input is a timestamp (number), create a Date object from it
    const newDate = new Date(date);
    return isNaN(newDate.getTime()) ? null : newDate;
  } else if (typeof date === 'string') {
    // If the input is a string, attempt to parse it as a Date
    const parsedDate = new Date(date);

    // If the parsed date is invalid, return null
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  } else {
    // If input type is not Date, number, or string, return null
    return null;
  }
};

/**
 * Compare if two dates are the same.
 *
 * @param {Date | number | string} date1 - The first date.
 * @param {Date | number | string} date2 - The second date.
 * @returns {boolean} Returns true if the two dates are the same day, otherwise false.
 */
export const areDatesSame = (date1: Date | number | string, date2: Date | number | string): boolean => {
  return isSameDay(getDateObject(date1), getDateObject(date2));
};

/**
 * Checks if two dates belong to the same week.
 *
 * @param {Date | number} date1 - The first date to compare.
 * @param {Date | number} date2 - The second date to compare.
 * @param {number} [weekStartsOn=0] - The first day of the week (0 = Sunday, 1 = Monday, etc.)
 * @returns {boolean} Returns true if both dates are in the same week, otherwise false.
 */
export const areDatesInSameWeek = (
  date1: Date | number | string,
  date2: Date | number | string,
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 0,
) => {
  return isSameWeek(getDateObject(date1), getDateObject(date2), { weekStartsOn });
};

/**
 * Converts mins to HH:mm
 *
 * @param timeInMins
 * @returns
 */
export const convertMinutesToHoursMins = (timeInMins: number) => {
  const hours = Math.floor(timeInMins / 60);
  const minutes = timeInMins % 60;
  return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
};

type ComparisonOperator = '<' | '<=' | '>' | '>=' | '==' | '!=';
/**
 * Compares two dates without considering the time component.
 *
 * @param {Date | string | number} date1 - The first date to compare. Can be a Date object, a date string, or a timestamp.
 * @param {Date | string | number} date2 - The second date to compare. Can be a Date object, a date string, or a timestamp.
 * @param {ComparisonOperator} operator - The comparison operator to use ('<', '<=', '>', '>=', '==', '!=').
 * @returns {boolean} - The result of the comparison.
 *
 * @throws {Error} - Throws an error if an unsupported comparison operator is provided.
 */
export const compareDatesWithoutTime = (
  date1: Date | string | number,
  date2: Date | string | number,
  operator: ComparisonOperator,
): boolean => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  const normalizedD1 = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate());
  const normalizedD2 = new Date(d2.getFullYear(), d2.getMonth(), d2.getDate());

  switch (operator) {
    case '<':
      return normalizedD1 < normalizedD2;
    case '<=':
      return normalizedD1 <= normalizedD2;
    case '>':
      return normalizedD1 > normalizedD2;
    case '>=':
      return normalizedD1 >= normalizedD2;
    case '==':
      return normalizedD1.getTime() === normalizedD2.getTime();
    case '!=':
      return normalizedD1.getTime() !== normalizedD2.getTime();
    default:
      return false;
  }
};
