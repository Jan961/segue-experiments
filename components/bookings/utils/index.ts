export const DAY_TYPE_FILTERS = ['Performance', 'Rehearsal', 'Tech / Dress', 'Get in / Fit Up'];
export const RUN_OF_DATES_DAY_TYPE_FILTERS = [...DAY_TYPE_FILTERS, 'Day Off'];

export const getVenueForDayType = (dayTypeOptions, dayType) => {
  const selectedDayTypeOption = dayTypeOptions.find(({ value }) => dayType === value);
  if (selectedDayTypeOption) {
    return selectedDayTypeOption.text;
  }
  return '';
};

export const allowEditingForSelectedDayType = (dayTypeOptions, dayType) => {
  const selectedDayTypeOption = dayTypeOptions.find(({ value }) => dayType === value);
  return DAY_TYPE_FILTERS.includes(selectedDayTypeOption.text);
};
export const formatRowsForPencilledBookings = (values) => {
  const pencilled = values.filter(({ bookingStatus }) => bookingStatus === 'U' || bookingStatus === 'Pencilled');
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

const hasMoreThanOneRunOfDates = (values) => {
  const groupByRunOfDates = values.reduce((acc, item) => {
    if (acc[item.runTag] !== undefined) {
      acc[item.runTag] = acc[item.runTag] + 1;
    } else {
      acc[item.runTag] = 1;
    }
    return acc;
  }, {});
  return Object.values(groupByRunOfDates).length > 1;
};

export const formatRowsForMultipeBookingsAtSameVenue = (values) => {
  const groupedByVenue = values.reduce((acc, item) => {
    if (item.venue) {
      const key = `${item.venue}`;
      acc[key] !== undefined ? acc[key].push(item) : (acc[key] = [item]);
    }
    return acc;
  }, {});

  const venuesWithMultipleBookings: any = Object.entries(groupedByVenue)
    .filter(([_, v]: [string, Array<any>]) => hasMoreThanOneRunOfDates(v))
    .map((arr) => arr[1])
    .flat();

  const updated = values.map((r) => {
    const venueHasMultipleBookings = venuesWithMultipleBookings.find(({ Id }) => r.Id === Id) !== undefined;
    return { ...r, venueHasMultipleBookings };
  });

  return updated;
};
