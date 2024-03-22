export const DAY_TYPE_FILTERS = ['Performance', 'Rehearsal', 'Tech / Dress', 'Get in / Fit Up', 'Get Out'];
export const RUN_OF_DATES_DAY_TYPE_FILTERS = [...DAY_TYPE_FILTERS, 'Day Off'];

export const getVenueForDayType = (dayTypeOptions, dayType) => {
  const selectedDayTypeOption = dayTypeOptions.find(({ value }) => dayType === value);
  if (selectedDayTypeOption && !DAY_TYPE_FILTERS.includes(selectedDayTypeOption.text)) {
    return selectedDayTypeOption.text;
  }
  return '';
};

export const allowEditingForSelectedDayType = (dayTypeOptions, dayType) => {
  const selectedDayTypeOption = dayTypeOptions.find(({ value }) => dayType === value);
  return DAY_TYPE_FILTERS.includes(selectedDayTypeOption.text);
};
