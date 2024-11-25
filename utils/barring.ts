import { getMonday, newDate } from 'services/dateService';

export const getDateFromWeekNumber = (date: string, weeknum: number) => {
  if (!weeknum || !date) return null;
  const startDate = newDate(date);
  const numberOfDays = Math.abs(weeknum) * 7;
  startDate.setDate(weeknum < 0 ? startDate.getDate() - numberOfDays : startDate.getDate() + numberOfDays);
  return getMonday(startDate.toISOString()).toISOString();
};
