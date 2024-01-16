import { SelectOption } from 'components/global/forms/FormInputSelect';

export const weekOptions: SelectOption[] = Array.from(Array(104).keys()).map((x) => {
  const week = x - 52;
  const formattedWeek = week < 0 ? `week - ${Math.abs(week)}` : `week + ${week + 1}`;
  return {
    text: formattedWeek,
    value: week < 0 ? week : week + 1,
  };
});
