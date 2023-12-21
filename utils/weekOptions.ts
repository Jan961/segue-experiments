import { SelectOption } from 'components/global/forms/FormInputSelect';
import { getMonday } from 'services/dateService';

export const weekOptions: SelectOption[] = Array.from(Array(104).keys()).map((x) => {
  const week = x - 52;
  const formattedWeek = week < 0 ? `week - ${Math.abs(week)}` : `week + ${week}`;
  return {
    text: formattedWeek,
    value: week,
  };
});

const getDateFromWeekNum = (date: string, weeknum: number) => {
  const startDate = new Date(date);
  const numberOfDays = Math.abs(weeknum) * 7;
  startDate.setDate(weeknum < 0 ? startDate.getDate() - numberOfDays : startDate.getDate() + numberOfDays);
  return getMonday(startDate.toISOString()).toISOString();
};

const getWeekNumsToDateMap = (StartDate: string, EndDate: string, list: number[]) => {
  return list.reduce((weeknumToDateMap, weeknum) => {
    weeknumToDateMap[weeknum] = getDateFromWeekNum(StartDate, weeknum);
    return weeknumToDateMap;
  }, {});
};
export default getWeekNumsToDateMap;
