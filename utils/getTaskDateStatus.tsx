import { SelectOption } from 'components/global/forms/FormInputSelect';

export default function getTaskDateStatusColor(date: string, status: string) {
  if (status && status.toLowerCase() === 'done') {
    return 'bg-none';
  }

  if (date) {
    const inputDate = new Date(date);
    const today = new Date();
    const differenceInDays = Math.ceil((inputDate.getTime() - today.getTime()) / (1000 * 3600 * 24));

    if (differenceInDays <= 7 && differenceInDays >= 0) {
      return 'orange';
    } else if (differenceInDays < 0) {
      return 'red';
    } else {
      return 'green';
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
