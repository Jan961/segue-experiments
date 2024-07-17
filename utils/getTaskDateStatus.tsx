import { SelectOption } from 'components/global/forms/FormInputSelect';
import { isThisWeek } from 'date-fns';
import { formatDateUK } from '../services/dateService';

export default function getTaskDateStatusColor(date: string, progress: number) {
  if (progress === 100) {
    return '#10841C';
  }

  if (date) {
    const dueDate = new Date(date);
    const today = new Date();
    if (isThisWeek(dueDate)) {
      return '#EA8439';
    } else if (dueDate < today) {
      return '#D41818';
    }
  }

  return 'bg-none';
}

export const weekOptions: SelectOption[] = Array.from(Array(104).keys()).map((x) => {
  const formatWeekOption = (week: number) => {
    const formattedWeek = week < 0 ? `${week}` : `+ ${week}`;
    return {
      text: formattedWeek,
      value: week,
    };
  };
  const week = x - 52;
  return week < 0 ? formatWeekOption(week) : formatWeekOption(week + 1);
});

const formatWeekOption = (week: number, prefix = '') => {
  prefix += ' | ';
  const formattedWeek = week < 0 ? `${prefix} - ${Math.abs(week)}` : `${prefix} + ${week}`;
  return {
    text: formattedWeek,
    value: week,
  };
};

export const getWeekOptions = (production): SelectOption[] => {
  const startDate = new Date(production?.StartDate);
  const millisecondsPerWeek = 7 * 24 * 60 * 60 * 1000;
  console.log(production);

  const numWeeksInDropDown = 52;
  return Array.from(Array(numWeeksInDropDown * 2).keys()).map((x) => {
    const week = x - numWeeksInDropDown;
    if (production) {
      const weeklyDate = new Date(startDate.getTime() + week * millisecondsPerWeek);
      return week < 0
        ? formatWeekOption(week, formatDateUK(weeklyDate))
        : formatWeekOption(week + 1, formatDateUK(weeklyDate));
    }

    return week < 0 ? formatWeekOption(week) : formatWeekOption(week + 1);
  });
};
