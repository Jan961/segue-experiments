export function getAdjustedDateByWeeks(weeks = 0): string {
  const currentDate = new Date();
  const daysToAdjust = weeks * 7;
  currentDate.setDate(currentDate.getDate() + daysToAdjust);

  // Format the date to "dd/mm/yy"
  const day = currentDate.getDate().toString().padStart(2, '0');
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
  const year = currentDate.getFullYear().toString().slice(2);

  return `${day}/${month}/${year}`;
}
