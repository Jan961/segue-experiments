export const INITIAL_STATE = {
  form: {
    fromDate: '',
    toDate: '',
    isDateTypeOnly: false,
    dateType: null,
    venueId: null,
    shouldFilterVenues: false,
    isRunOfDates: false,
  },
  bookingConflicts: [],
};

export const Actions = {
  UPDATE_FORM_DATA: 'UPDATE_FORM_DATA',
  UPDATE_BOOKING_CONFLICTS: 'UPDATE_BOOKING_CONFLICTS',
};

export const steps = [
  'Create New Booking',
  'Booking Conflict',
  'Barring Issue',
  'New Booking Details',
  'Preview New Booking',
  'Venue Gap Suggestions',
];

export const BookingTypes = [
  {
    text: 'Venue',
    value: 'venueType',
  },
  {
    text: 'Day Type Only',
    value: 'dateTypeOnly',
  },
];
export const BookingTypeMap = {
  VENUE: 'venueType',
  DATE_TYPE: 'dateTypeOnly',
};

export const DayTypeEdit = {};
