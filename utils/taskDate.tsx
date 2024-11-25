import { SelectOption } from 'components/global/forms/FormInputSelect';
import { isThisWeek } from 'date-fns';
import { formatShortDateUK, newDate } from 'services/dateService';

export default function getTaskDateStatusColor(date: string, progress: number) {
  if (progress === 100) {
    return '#10841C';
  }

  if (date) {
    const dueDate = newDate(date);
    const today = newDate();
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

const formatWeekOption = (week: number, suffix = '') => {
  suffix = suffix.length > 0 ? ' | ' + suffix : suffix;
  const formattedWeek = week < 0 ? ` -${Math.abs(week)} ${suffix}` : ` +${week} ${suffix}`;
  return {
    text: formattedWeek,
    value: week,
  };
};

export const getWeekOptions = (production, isMasterTask: boolean, appendDate: boolean): SelectOption[] => {
  const eotNumber = 26;
  const numWeeksInDropDown = 260;
  if (!isMasterTask && production) {
    const startDate = newDate(production?.StartDate);
    const endDate = newDate(production?.EndDate);
    const millisecondsPerWeek = 7 * 24 * 60 * 60 * 1000;

    const numTourWeeks: number =
      Math.ceil((endDate.getTime() - startDate.getTime()) / millisecondsPerWeek) || -eotNumber;
    return Array.from(Array(numWeeksInDropDown + numTourWeeks + eotNumber).keys()).map((x) => {
      const week = x - numWeeksInDropDown;
      const weeklyDate = newDate(startDate.getTime() + week * millisecondsPerWeek);
      if (week < 0) {
        return formatWeekOption(week, appendDate ? formatShortDateUK(weeklyDate) : '');
      } else if (week >= 0 && week < numTourWeeks) {
        return formatWeekOption(week + 1, appendDate ? formatShortDateUK(weeklyDate) : '');
      } else {
        const optionOutput = `EOT+${week + 1 - numTourWeeks} ${
          appendDate ? '| ' + formatShortDateUK(weeklyDate) : ''
        } `;
        return { text: optionOutput, value: week + 1 };
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
