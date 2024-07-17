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
  prefix = prefix.length > 0 ? prefix + ' | ' : prefix;
  const formattedWeek = week < 0 ? `${prefix} - ${Math.abs(week)}` : `${prefix} + ${week}`;
  return {
    text: formattedWeek,
    value: week,
  };
};

export const getWeekOptions = (production, isMasterTask: boolean): SelectOption[] => {
  const eotNumber = isMasterTask ? 26 : 0;
  const numWeeksInDropDown = isMasterTask ? 260 : 52;
  return Array.from(Array(numWeeksInDropDown * 2 + eotNumber).keys()).map((x) => {
    const week = x - numWeeksInDropDown;
    if (!isMasterTask && production) {
      const startDate = new Date(production?.StartDate);
      const millisecondsPerWeek = 7 * 24 * 60 * 60 * 1000;

      const weeklyDate = new Date(startDate.getTime() + week * millisecondsPerWeek);
      return week < 0
        ? formatWeekOption(week, formatDateUK(weeklyDate))
        : formatWeekOption(week + 1, formatDateUK(weeklyDate));
    } else {
      const weekDifference = week - numWeeksInDropDown;
      if (weekDifference >= 0) return { text: `EOT+${weekDifference + 1}`, value: week };

      console.log(weekDifference);
      return week < 0 ? formatWeekOption(week) : formatWeekOption(week + 1);
    }
  });
};
