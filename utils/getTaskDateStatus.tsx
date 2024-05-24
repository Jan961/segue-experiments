import { SelectOption } from 'components/global/forms/FormInputSelect';
import { isThisWeek } from 'date-fns';

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
  const week = x - 52;
  const formattedWeek = week < 0 ? ` - ${Math.abs(week)}` : `+ ${week}`;
  return {
    text: formattedWeek,
    value: week,
  };
});

export const getWeekOptions = (prefix = 'week'): SelectOption[] =>
  Array.from(Array(104).keys()).map((x) => {
    const week = x - 52;
    const formattedWeek = week < 0 ? `${prefix} - ${Math.abs(week)}` : `${prefix} + ${week}`;
    return {
      text: formattedWeek,
      value: week,
    };
  });
