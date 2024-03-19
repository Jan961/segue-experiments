export const getVenueForDayType = (dayTypeOptions, dayType) => {
  const DAY_TYPE_FILTERS = ['Performance', 'Rehearsal', 'Tech / Dress', 'Get in / Fit Up', 'Get Out'];
  const selectedDayTypeOption = dayTypeOptions.find(({ value }) => dayType === value);
  if (selectedDayTypeOption && !DAY_TYPE_FILTERS.includes(selectedDayTypeOption.text)) {
    return selectedDayTypeOption.text;
  }
  return '';
};
