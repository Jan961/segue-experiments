import { SelectOption } from 'components/global/forms/FormInputSelect';
import { isThisWeek } from 'date-fns';

export default function getTaskDateStatusColor(date: string, progress: number) {
  if (progress === 100) {
    return 'green';
  }

  if (date) {
    const dueDate = new Date(date);
    const today = new Date();
    if (isThisWeek(dueDate)) {
      return 'orange';
    } else if (dueDate < today) {
      return 'red';
    }
  }

  return 'bg-none';
}

export const weekOptions: SelectOption[] = Array.from(Array(104).keys()).map((x) => {
  const week = x - 52;
  const formattedWeek = week < 0 ? `week - ${Math.abs(week)}` : `week + ${week}`;
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
