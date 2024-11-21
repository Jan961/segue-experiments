import {
  startOfWeek,
  differenceInWeeks,
  addWeeks,
  isBefore,
  isValid,
  format,
  isSameDay,
  addMinutes,
  addMonths,
  differenceInDays,
  addDays,
} from 'date-fns';
import moment from 'moment';
import { UTCDate } from '@date-fns/utc';

// regex for date patterns
export const DATE_PATTERNS = {
  shortSlash: /(\d{2}\/\d{2}\/\d{2})/,
  longSlash: /(\d{2}\/\d{2}\/\d{4})/,
  shortDash: /(\d{2}-\d{2}-\d{2})/,
  longDash: /(\d{2}-\d{2}-\d{4})/,
  utcSlash: /(\d{4}\/\d{2}\/\d{2})/,
  utcDash: /(\d{4}-\d{2}-\d{2})/,
};
const YEAR_CONSTANT = 2000;
export type Locale = 'UK' | 'US';

// Disect the time string into hours, minutes and seconds
const disectTime = (time: string) => {
  if (!time) {
    return { h: 0, m: 0, s: 0 };
  }
  const t = time.split(':');
  const s = t[2]?.includes('.') ? t[2].split('.') : t[2];
  return { h: Number(t[0]), m: Number(t[1]), s: s ? Number(s[0].includes('z') ? s[0].slice(0, 1) : s[0]) : 0 };
};

/**
 * Return a UTCDate object from a string in any valid format or returns a new UTCDate object of the current day and time if there is no input.
 *
 * @param {string | number} date - The date to parse in any valid format.
 * @param {Locale} locale - The locale of the inputted date.
 * @returns {UTCDate} Returns a UTCDate object of the date string.
 */
export const newDate = (date?: string | number, locale?: Locale): UTCDate => {
  if (!date) {
    return new UTCDate();
  }
  if (typeof date === 'string') {
    const d = date.split('T');
    if (locale && !(date.match(DATE_PATTERNS.utcDash) || date.match(DATE_PATTERNS.utcSlash))) {
      switch (locale) {
        case 'US':
          return getUTCFromUSDateString(date);
        case 'UK':
          return getUTCFromUKDateString(date);
        default:
          return null;
      }
    } else {
      if (d[0].match(DATE_PATTERNS.utcSlash)) {
        const split = d[0].split('/');
        const time = disectTime(d[1]);
        return new UTCDate(Number(split[0]), Number(split[1]) - 1, Number(split[2]), time.h, time.m, time.s);
      }
      if (d[0].match(DATE_PATTERNS.utcDash)) {
        const split = d[0].split('-');
        const time = disectTime(d[1]);
        return new UTCDate(Number(split[0]), Number(split[1]) - 1, Number(split[2]), time.h, time.m, time.s);
      }
    }
  }
  if (typeof date === 'number') {
    const d = new UTCDate(date);
    return isValid(d) ? d : null;
  }
  return null;
};

// Return a UTCDate object from a UK datestring
const getUTCFromUKDateString = (date: string) => {
  if (!date) {
    return null;
  }
  const d = date.split('T');
  const time = disectTime(d[1]);
  if (d[0].match(DATE_PATTERNS.longSlash)) {
    const split = d[0].split('/');
    return new UTCDate(Number(split[2]), Number(split[1]) - 1, Number(split[0]), time.h, time.m, time.s);
  }
  if (d[0].match(DATE_PATTERNS.longDash)) {
    const split = d[0].split('-');
    return new UTCDate(Number(split[2]), Number(split[1]) - 1, Number(split[0]), time.h, time.m, time.s);
  }
  if (d[0].match(DATE_PATTERNS.shortSlash)) {
    const split = d[0].split('/');
    return new UTCDate(
      YEAR_CONSTANT + Number(split[2]),
      Number(split[1]) - 1,
      Number(split[0]),
      time.h,
      time.m,
      time.s,
    );
  }
  if (d[0].match(DATE_PATTERNS.shortDash)) {
    const split = d[0].split('-');
    return new UTCDate(
      YEAR_CONSTANT + Number(split[2]),
      Number(split[1]) - 1,
      Number(split[0]),
      time.h,
      time.m,
      time.s,
    );
  }
  return null;
};

// Return a UTCDate object from a US datestring
const getUTCFromUSDateString = (date: string) => {
  if (!date) {
    return null;
  }
  const d = date.split('T');
  const time = disectTime(d[1]);
  if (d[0].match(DATE_PATTERNS.longSlash)) {
    const split = d[0].split('/');
    return new UTCDate(Number(split[2]), Number(split[0]) - 1, Number(split[1]), time.h, time.m, time.s);
  }
  if (d[0].match(DATE_PATTERNS.longDash)) {
    const split = d[0].split('-');
    return new UTCDate(Number(split[2]), Number(split[0]) - 1, Number(split[1]), time.h, time.m, time.s);
  }
  if (d[0].match(DATE_PATTERNS.shortSlash)) {
    const split = d[0].split('/');
    return new UTCDate(
      YEAR_CONSTANT + Number(split[2]),
      Number(split[0]) - 1,
      Number(split[1]),
      time.h,
      time.m,
      time.s,
    );
  }
  if (d[0].match(DATE_PATTERNS.shortDash)) {
    const split = d[0].split('-');
    return new UTCDate(
      YEAR_CONSTANT + Number(split[2]),
      Number(split[0]) - 1,
      Number(split[1]),
      time.h,
      time.m,
      time.s,
    );
  }
  return null;
};

/**
 * Returns a UTCDate object for any valid dates or returns a new UTCDate object of the current date and time if there is no input.
 *
 * @param {string | UTCDate | number} date - The date to be parsed.
 * @returns {UTCDate} Returns a UTCDate object of the given date.
 */
export const safeDate = (date: UTCDate | string | number, locale?: Locale): UTCDate => {
  if (!date) {
    return newDate();
  }
  if (typeof date === 'string') {
    const d = newDate(date, locale);
    return isValid(d) ? d : null;
  }
  if (typeof date === 'number') {
    const d = newDate(date);
    return isValid(d) ? d : null;
  }
  return isValid(date) ? date : null;
};

/**
 * Returns yyyy-mm-dd of a valid date string format yyyy-mm-ddT00:00:00Z | yyyy-mm-dd
 *
 * @param {string | UTCDate | number} date - The date to get the key of.
 * @returns {string} Returns the key of a date in string format yyyy-mm-dd.
 */
export const getKey = (date: string | UTCDate | number, locale?: Locale): string => {
  if (!date) {
    return null;
  }
  const d = safeDate(date, locale);
  return d ? d.toISOString().split('T')[0] : null;
};

// return ?
export const dateStringToPerformancePair = (dateString: string, locale?: Locale) => {
  if (!dateString) {
    return null;
  }
  const split = dateString.split('T');
  const datePart = split[0];
  const timePart = split[1];

  const defaultDatePart = '1970-01-01';
  const time = safeDate(`${defaultDatePart}T${timePart}Z`, locale);
  const date = safeDate(`${datePart}`, locale);

  return {
    Time: isValid(time) ? time : null,
    Date: isValid(date) ? date : null,
  };
};

/**
 * Return a UTCDate object from a string in format of MDY.
 *
 * @param {string} date - The date string to parse in MDY format.
 * @returns {UTCDate} Returns a UTCDate object if the date string.
 */
export const simpleToDateMDY = (date: string): UTCDate => {
  if (!date) {
    return null;
  }
  return getUTCFromUSDateString(date);
};

/**
 * Return a UTCDate object from a string in format of DMY.
 *
 * @param {string} date - The date string to parse in DMY format.
 * @returns {UTCDate} Returns a UTCDate object if the date string.
 */
export const simpleToDateDMY = (date: string): UTCDate => {
  if (!date) {
    return null;
  }
  return getUTCFromUKDateString(date);
};

/**
 * Return a date string of format dd/mm/yy from a UTCDate object or string format with optional locale.
 *
 * @param {UTCDate | string | number} dateToFormat - The date in either UTCDate object or string format.
 * @param {Locale} locale - The locale value of the inputted date.
 * @returns {string} Return a date string of format dd/mm/yy.
 */
export const dateToSimple = (dateToFormat: UTCDate | string | number, locale?: Locale): string => {
  if (!dateToFormat) return null;
  const date = safeDate(dateToFormat, locale);
  const options: Intl.DateTimeFormatOptions = {
    year: '2-digit',
    day: '2-digit',
    month: '2-digit',
    timeZone: 'UTC',
  };
  return date ? date.toLocaleDateString('en-GB', options) : null;
};

/**
 * Return the time component of a date.
 *
 * @param {UTCDate | string | number} date - The date to get the time value from.
 * @param {Locale} locale - The locale value of the inputted date.
 * @returns {string} Returns the time value of the inputted date.
 */
export const dateTimeToTime = (date: string | UTCDate | number, locale?: Locale): string => {
  if (!date) {
    return null;
  }
  const newDate = safeDate(date, locale);
  return isValid(newDate) ? format(newDate, 'HH:mm') : null;
};

/**
 * Return the ISO value of a date.
 *
 * @param {UTCDate | string | number} date - The date to return ISO format of.
 * @returns {UTCDate | string | number} Returns the ISO formate of inputted date.
 */
export const toISO = (date: UTCDate | string | number, locale?: Locale): string => {
  if (!date) {
    return null;
  }
  const d = safeDate(date, locale);
  return d.toISOString();
};

/**
 * Return a date with x days difference.
 *
 * @param {UTCDate | string | number} date - The date to format.
 * @param {number} days - The number of days between the dates. Can be a negative value.
 * @param {Locale} locale - The locale value of the inputted date.
 * @returns {UTCDate} Returns the date x days away from the inputted date.
 */
export const getDateDaysAway = (date: UTCDate | string | number, days: number, locale?: Locale): UTCDate => {
  if (!date) {
    return null;
  }
  const d = safeDate(date, locale);
  return new UTCDate(addDays(d, days));
};

/**
 * Return a day string formatted with the day in either short or long form.
 *
 * @param {UTCDate | string | number} dateToFormat - The date to format.
 * @param {'Long' | 'Short'} format - Decide if the date should be formatted Long or Short.
 * @param {Locale} locale - The locale value of the inputted date.
 * @returns {string} Returns the day string formatted either Long or Short depending on input.
 */
export const getWeekDay = (
  dateToFormat: UTCDate | string | number,
  format: 'long' | 'short',
  locale?: Locale,
): string => {
  if (!dateToFormat) {
    return null;
  }
  const date = safeDate(dateToFormat, locale);
  return date.toLocaleDateString('UTC', { weekday: format });
};

/**
 * Return a date string formatted with the day in either short or long form.
 *
 * @param {UTCDate | string | number} dateToFormat - The date to format.
 * @param {'Long' | 'Short'} weekDayFormat - Decide if the date should be formatted Long or Short.
 * @param {Locale} locale - The locale value of the inputted date.
 * @returns {string} Returns a date string formatted either Long or Short depending on input.
 */
export const formattedDateWithWeekDay = (
  dateToFormat: UTCDate | string | number,
  weekDayFormat: 'Long' | 'Short',
  locale?: Locale,
): string => {
  if (!dateToFormat) {
    return null;
  }
  const shortFormat = 'EEE dd/MM/yy';
  const longFormat = 'EEEE dd/MM/yyyy';
  const date = safeDate(dateToFormat, locale);
  return isValid(date) ? format(date, weekDayFormat === 'Long' ? longFormat : shortFormat) : null;
};

/**
 * Returns the number of weeks passed from productionStart to dateToNumber.
 *
 * @param {UTCDate | string | number} productionStart - The date to calculate from.
 * @param {UTCDate | string | number} dateToNumber - The date to calculate to.
 * @returns {number} Returns the number of weeks passed.
 */
export const calculateWeekNumber = (
  productionStart: UTCDate | string | number,
  dateToNumber: UTCDate | string | number,
): number => {
  if (!productionStart || !dateToNumber) {
    return null;
  }
  const d1 = safeDate(productionStart);
  const d2 = safeDate(dateToNumber);
  const weekOneStart = startOfWeek(d1, { weekStartsOn: 1 });
  let weekNumber = differenceInWeeks(d2, weekOneStart);

  // Handle the week boundary condition
  const adjustedStartDate = addWeeks(weekOneStart, weekNumber);
  if (isBefore(d2, adjustedStartDate)) weekNumber -= 1;
  if (isBefore(d2, weekOneStart)) weekNumber -= 1;

  weekNumber += 1;

  return weekNumber;
};

/**
 * Returns a date 1 month after the given date.
 *
 * @param {UTCDate | string | number} date - The date to add 1 month to.
 * @param {Locale?} locale - The locale value of the inputted date.
 * @returns {UTCDate} Returns a date object 1 month after inputted date.
 */
export const addOneMonth = (date: UTCDate | string | number, locale?: Locale): UTCDate => {
  if (!date) {
    return null;
  }
  const newDate = safeDate(date, locale);
  return safeDate(addMonths(newDate, 1).getTime());
};

/**
 * Format a given number into 'HH:mm'.
 *
 * @param {number} mins - The date of the week to get the Monday of.
 * @returns {string} Returns the monday date object on the week of the inputted date.
 */
export const timeFormat = (mins?: number): string => {
  if (!mins || mins < -1440 || mins > 1440) {
    return null;
  }
  return `${Math.floor(mins / 60)}:${String(mins % 60).padStart(2, '0')}`;
};

/**
 * Formats a given date into short form in UK locale.
 *
 * @param {UTCDate | string | number} date - The date to format.
 * @param {Locale?} locale - The locale value of the inputted date.
 * @returns {string} Returns the date formatted to short form in UK locale.
 */
export const formatShortDateUKV2 = (date: UTCDate | string | number, locale?: Locale): string => {
  if (!date) {
    return null;
  }
  const newDate = safeDate(date, locale);
  return format(newDate, 'dd/MM/yy');
};

/**
 * Get the Monday of the given dates week.
 *
 * @param {UTCDate | string | number} inputDate - The date of the week to get the Monday of.
 * @param {Locale?} locale - The locale value of the inputted date.
 * @returns {UTCDate} Returns the monday date object on the week of the inputted date.
 */
export const getMonday = (inputDate: UTCDate | string | number, locale?: Locale): UTCDate => {
  if (!inputDate) {
    return null;
  }
  const currentDateObj = safeDate(inputDate, locale);
  currentDateObj.setDate(currentDateObj.getDate() - ((currentDateObj.getDay() + 6) % 7));
  return currentDateObj;
};

/**
 * Get the Sunday of the given dates week.
 *
 * @param {UTCDate | string | number} inputDate - The date of the week to get the Sunday of.
 * @param {Locale?} locale - The locale value of the inputted date.
 * @returns {UTCDate} Returns the Sunday date object on the week of the inputted date.
 */
export const getSunday = (inputDate: UTCDate | string | number, locale?: Locale): UTCDate => {
  if (!inputDate) {
    return null;
  }
  const currentDate = safeDate(inputDate, locale);
  const res = getDateDaysAway(getMonday(currentDate), 6);
  return res;
};

/**
 * Get date in format yyyy-mm-dd.
 *
 * @param {UTCDate | string | number} date - The date to convert to sql.
 * @param {Locale?} locale - The locale value of the inputted date.
 * @returns {string} Returns the date in the format yyyy-mm-dd.
 */
export const toSql = (date: string | UTCDate | number, locale?: Locale): string => {
  if (!date) {
    return null;
  }
  const d = safeDate(date, locale);
  return getKey(d);
};

// NEEDS REVIEW WITH ARUN
export function getDurationV2(upTime: string, downTime: string): number {
  if (upTime === '' || downTime === '') {
    return 0;
  }
  const up = new Date(`2023-01-01 ${upTime}`);
  const down = new Date(`2023-01-01 ${downTime}`);
  const diff = down.getTime() - up.getTime();
  return diff;
}

/**
 * Check if the date ranges overlap.
 *
 * @param {UTCDate} start1 - First date for first date range.
 * @param {UTCDate} end1 - Last date for first date range.
 * @param {UTCDate} start2 - First date for second date range.
 * @param {UTCDate} end2 - Last date for the second date range.
 * @returns {boolean} Returns if there is an overlap in the date ranges.
 */
export const checkDateOverlapV2 = (start1: UTCDate, end1: UTCDate, start2: UTCDate, end2: UTCDate): boolean => {
  return !((start1 < start2 && end1 < start2) || (start1 > end2 && end2 > end1));
};

/**
 * Return a list of dates from the start date to the end date.
 *
 * @param {UTCDate | string | number} start - The start date.
 * @param {UTCDate | string | number} end - The end date.
 * @param {Locale} startLocale - The locale of the start date.
 * @param {Locale} endLocale - The locale of the end date.
 * @returns {string[]} Returns a list of dates betwen the start date and the ends date.
 */
export const getArrayOfDatesBetween = (
  start: string | UTCDate | number,
  end: string | UTCDate | number,
  startLocale?: Locale,
  endLocale?: Locale,
): string[] => {
  if (!start || !end) {
    return [];
  }
  const arr: string[] = [];
  const startDate = safeDate(start, startLocale);
  const endDate = safeDate(end, endLocale);
  for (let dt = startDate; dt <= endDate; dt = getDateDaysAway(dt, 1)) {
    arr.push(dt.toISOString());
  }
  return arr.map((x) => getKey(x));
};

/**
 * Format a date.
 *
 * @param {UTCDate | string | number} date - The date to format.
 * @param {string} dateFormat - The value of the format for the date.
 * @returns {UTCDate} Returns formatted string of the date.
 */
export const formatDate = (date: UTCDate | string | number, dateFormat: string): string => {
  if (!date) {
    return null;
  }
  const newDate = safeDate(date);
  return format(newDate, dateFormat);
};

/**
 * Compare if two dates are the same.
 *
 * @param {UTCDate | string | number} date1 - The first date.
 * @param {UTCDate | string | number} date2 - The second date.
 * @returns {boolean} Returns true if the two dates are the same day, otherwise false.
 */
export const areDatesSame = (date1: UTCDate | string | number, date2: UTCDate | string | number): boolean => {
  if (!date1 || !date2) {
    return null;
  }
  return isSameDay(safeDate(date1), safeDate(date2));
};

type ComparisonOperator = '<' | '<=' | '>' | '>=' | '==' | '!=';
/**
 * Compares two dates without considering the time component.
 *
 * @param {UTCDate | string} date1 - The first date to compare. Can be a Date object, a date string, or a timestamp.
 * @param {UTCDate | string} date2 - The second date to compare. Can be a Date object, a date string, or a timestamp.
 * @param {ComparisonOperator} operator - The comparison operator to use ('<', '<=', '>', '>=', '==', '!=').
 * @returns {boolean} - The result of the comparison.
 *
 * @throws {Error} - Throws an error if an unsupported comparison operator is provided.
 */
export const compareDatesWithoutTime = (
  date1: UTCDate | string | number,
  date2: UTCDate | string | number,
  operator: ComparisonOperator,
): boolean => {
  const d1 = safeDate(date1);
  const d2 = safeDate(date2);

  switch (operator) {
    case '<':
      return d1 < d2;
    case '<=':
      return d1 <= d2;
    case '>':
      return d1 > d2;
    case '>=':
      return d1 >= d2;
    case '==':
      return d1 === d2;
    case '!=':
      return d1 !== d2;
    default:
      return false;
  }
};

/**
 * Combine a date and a time into a dateTime.
 *
 * @param {UTCDate | string | number} date - The date to add a time to.
 * @param {string} time - The time to add to the date.
 * @param {Locale} locale - The locale of the inputted date.
 * @returns {UTCDate} Returns the combined dateTime of the date and time input.
 */
export const getDateTime = (date: string | UTCDate | number, time: string, locale?: Locale) => {
  if (!date || !time) {
    return null;
  }
  const d = getKey(date, locale);
  console.log(d);
  const dSplit = d.split('-');
  const tSplit = disectTime(time);
  if (!dSplit) {
    return null;
  }
  const res = new UTCDate(Number(dSplit[0]), Number(dSplit[1]) - 1, Number(dSplit[2]), tSplit.h, tSplit.m, tSplit.s);
  return isValid(res) ? res : null;
};

/**
 * Get the difference between dates by days.
 *
 * @param {UTCDate | string | number} fromDate - The date to start counting from.
 * @param {UTCDate | string | number} toDate - The date to count to.
 * @param {Locale} fromLocale - The locale of the first inputted date.
 * @param {Locale} toLocale - The locale of the second inputted date.
 * @returns {number} Returns the difference in days between the dates.
 */
export const getDifferenceInDays = (
  fromDate: string | UTCDate | number,
  toDate: string | UTCDate | number,
  fromLocale?: Locale,
  toLocale?: Locale,
): number => {
  if (!fromDate || !toDate) {
    return null;
  }

  const fDate = safeDate(fromDate, fromLocale);
  const tDate = safeDate(toDate, toLocale);

  if (!isValid(fDate) || !isValid(tDate)) {
    return null;
  }

  return differenceInDays(tDate, fDate);
};

/**
 * Get the difference between dates by weeks.
 *
 * @param {UTCDate | string | number} fromDate - The date to start counting from.
 * @param {UTCDate | string | number} toDate - The date to count to.
 * @param {Locale} fromLocale - The locale of the first inputted date.
 * @param {Locale} toLocale - The locale of the second inputted date.
 * @returns {number} Returns the difference in weeks between the dates.
 */
export const getDifferenceInWeeks = (
  fromDate: string | UTCDate | number,
  toDate: string | UTCDate | number,
  fromLocale?: Locale,
  toLocale?: Locale,
): number => {
  if (!fromDate || !toDate) {
    return null;
  }

  const fDate = safeDate(fromDate, fromLocale);
  const tDate = safeDate(toDate, toLocale);

  if (!isValid(fDate) || !isValid(tDate)) {
    return null;
  }

  return differenceInWeeks(tDate, fDate);
};

// DEPRECATED -- ARUN NEEDS CONSULTING
export const formatDateWithTimezoneOffset = ({
  date,
  dateFormat = 'dd/MM/yy',
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

// DEPRECATED -- ARUN NEEDS CONSULTING
export const getDateWithOffset = (date: Date) => {
  const timezoneOffset = getTimezonOffset();
  const dateWithOffset = addMinutes(date, -timezoneOffset);

  return dateWithOffset;
};

// DEPRECATED -- ARUN NEEDS CONSULTING
export const getTimezonOffset = () => {
  return new Date().getTimezoneOffset();
};

// DEPRECATED
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

// deprecated?
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

// DEPRECATED
export const todayToSimple = () => {
  const date = new Date();
  return date.toDateString();
};

// DEPRECATED
export const simpleToDate = (stringToFormat: string): Date => {
  const parts = stringToFormat?.split?.('/');
  return new Date(Number(`20${parts[2]}`), Number(Number(parts[0]) - 1), Number(parts[1]));
};

// DEPRECATED
export const getShortWeekFormat = (dateToFormat: Date | string) => {
  const weekdayName = moment(dateToFormat).format('ddd');
  return weekdayName;
};

// DEPRECATED
export const formatShortDateUK = (date) => {
  return format(new Date(date), 'dd/MM/yy');
};

// DEPRECATED
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

// DEPRECATED
export function getDuration(upTime: string, downTime: string): number {
  if (upTime === '' || downTime === '') {
    return 0;
  }
  const up = new Date(`2023-01-01 ${upTime}`);
  const down = new Date(`2023-01-01 ${downTime}`);
  const diff = down.getTime() - up.getTime();
  return diff;
}

// DEPRECATED
export const checkDateOverlap = (start1: Date, end1: Date, start2: Date, end2: Date): boolean => {
  return !((start1 < start2 && end1 < start2) || (start1 > end2 && end2 > end1));
};
