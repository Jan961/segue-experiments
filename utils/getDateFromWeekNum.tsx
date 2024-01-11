import { getMonday } from 'services/dateService';

function getDateFromWeekNum(weekNum: string | number, weekNumToDateMap: { [x: string]: any; [x: number]: Date }) {
  console.log('1', weekNumToDateMap);
  if (weekNumToDateMap && weekNumToDateMap[weekNum]) {
    return weekNumToDateMap[weekNum];
  }
  return 'N/A';
}

export const getDateFromWeekNumber = (date: string, weeknum: number) => {
  const startDate = new Date(date);
  const numberOfDays = Math.abs(weeknum) * 7;
  startDate.setDate(weeknum < 0 ? startDate.getDate() - numberOfDays : startDate.getDate() + numberOfDays);
  return getMonday(startDate.toISOString()).toISOString();
};

export const getWeekNumsToDateMap = (StartDate: string, EndDate: string, list: number[]) => {
  return list.reduce((weeknumToDateMap, weeknum) => {
    weeknumToDateMap[weeknum] = getDateFromWeekNumber(StartDate, weeknum);
    return weeknumToDateMap;
  }, {});
};

export default getDateFromWeekNum;