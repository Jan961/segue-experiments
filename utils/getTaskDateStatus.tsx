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
  const eotNumber = 26;
  const numWeeksInDropDown = 260;
  if (!isMasterTask && production) {
    const startDate = new Date(production?.StartDate);
    const endDate = new Date(production?.EndDate);
    const millisecondsPerWeek = 7 * 24 * 60 * 60 * 1000;

    const numTourWeeks: number =
      Math.ceil((endDate.getTime() - startDate.getTime()) / millisecondsPerWeek) || -eotNumber;
    console.log(production);
    console.log(numTourWeeks);
    return Array.from(Array(numWeeksInDropDown + numTourWeeks + eotNumber).keys()).map((x) => {
      const week = x - numWeeksInDropDown;
      const weeklyDate = new Date(startDate.getTime() + week * millisecondsPerWeek);
      if (week < 0) {
        return formatWeekOption(week, formatDateUK(weeklyDate));
      } else if (week >= 0 && week < numTourWeeks) {
        return formatWeekOption(week + 1, formatDateUK(weeklyDate));
      } else {
        const optionOutput = `${formatDateUK(weeklyDate)} | EOT+${week + 1 - numTourWeeks}`;
        return { text: optionOutput, value: week };
      }
    });
  } else {
    return Array.from(Array(numWeeksInDropDown * 2 + eotNumber).keys()).map((x) => {
      const week = x - numWeeksInDropDown;
      if (week < 0) {
        return formatWeekOption(week);
      } else if (week >= 0 && week < numWeeksInDropDown) {
        return formatWeekOption(week + 1);
      } else {
        const optionOutput = `EOT+${week - numWeeksInDropDown + 1}`;
        return { text: optionOutput, value: week };
      }
    });
  }
};
