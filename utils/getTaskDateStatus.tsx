import { SelectOption } from "components/global/forms/FormInputSelect";

export default function getTaskDateStatusColor(date: string, status: string) {
  if (status && status.toLowerCase() === 'done') {
    return 'bg-none';
  }

  if (date) {
    const inputDate = new Date(date);
    const today = new Date();
    const differenceInDays = Math.ceil((inputDate.getTime() - today.getTime()) / (1000 * 3600 * 24));

    if (differenceInDays <= 7 && differenceInDays >= 0) {
      return ' bg-amber-300 ';
    } else if (differenceInDays < 0) {
      return ' bg-red-300 ';
    } else {
      return ' bg-none ';
    }
  }

  return ' bg-none ';
}


export const weekOptions: SelectOption[] = Array.from(Array(104).keys()).map((x) => {
  const week = x - 52;
  const formattedWeek = week < 0 ? `week - ${Math.abs(week)}` : `week + ${week}`;
  return {
    text: formattedWeek,
    value: x,
  };
});