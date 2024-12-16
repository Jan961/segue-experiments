import { getMonday } from 'services/dateService';

/**
 * get the date from the week number
 * @param weekNum
 * @param weekNumToDateMap
 * @returns
 */
function getDateFromWeekNum(weekNum: string | number, weekNumToDateMap: { [x: string]: any; [x: number]: Date }) {
  if (weekNumToDateMap && weekNumToDateMap[weekNum]) {
    return weekNumToDateMap[weekNum];
  }
  return 'N/A';
}

/**
 * returns the date of the week number based on the start date
 * @param date
 * @param weeknum
 * @returns
 */
export const getDateFromWeekNumber = (date: string, weeknum: number) => {
  if (!weeknum || !date) return null;
  const startDate = new Date(date);
  const numberOfDays = Math.abs(weeknum < 0 ? weeknum : weeknum - 1) * 7;
  startDate.setDate(weeknum < 0 ? startDate.getDate() - numberOfDays : startDate.getDate() + numberOfDays);
  return getMonday(startDate.toISOString()).toISOString();
};

/**
 * calculate the week number based on the start date and current date for given list of week numbers
 * @param StartDate
 * @param EndDate
 * @param list
 * @returns
 */
export const getWeekNumsToDateMap = (StartDate: string, EndDate: string, list: number[]) => {
  return list.reduce((weeknumToDateMap, weeknum) => {
    weeknumToDateMap[weeknum] = getDateFromWeekNumber(StartDate, weeknum);
    return weeknumToDateMap;
  }, {});
};

export default getDateFromWeekNum;
