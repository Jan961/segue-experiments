export const DAY_TYPE_FILTERS = ['Performance', 'Rehearsal', 'Tech / Dress', 'Get in / Fit Up'];
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
export const formatRowsForPencilledBookings = (values) => {
  const pencilled = values.filter(({ bookingStatus }) => bookingStatus === 'Pencilled');
  const groupedByDate = pencilled.reduce((acc, item) => {
    if (acc[item.date] !== undefined) {
      acc[item.date] = acc[item.date] + 1;
    } else {
      acc[item.date] = 1;
    }
    return acc;
  }, {});

  const multiple = Object.entries(groupedByDate)
    .filter(([_, v]: [string, number]) => v > 1)
    .map((arr) => arr[0]);

  const updated = values.map((r) => (multiple.includes(r.date) ? { ...r, multipleVenuesOnSameDate: true } : r));
  return updated;
};

export const formatRowsForMultipeBookingsAtSameVenue = (values) => {
  const groupedByVenue = values.reduce((acc, item) => {
    if (item.venue) {
      const key = `${item.venue}_${item.runTag}`;
      acc[key] !== undefined ? (acc[key] = acc[key] + 1) : (acc[key] = 1);
    }

    return acc;
  }, {});

  const venuesWithMultipleBookings = Object.entries(groupedByVenue)
    .filter(([_, v]: [string, number]) => v > 1)
    .map((arr) => arr[0]);

  const updated = values.map((r) => ({
    ...r,
    venueHasMultipleBookings: venuesWithMultipleBookings.includes(`${r.venue}_${r.runTag}`),
  }));

  return updated;
};
