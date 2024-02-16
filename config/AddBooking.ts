export const INITIAL_STATE = {
  form: {
    fromDate: '',
    toDate: '',
    isDateTypeOnly: false,
    dateType: null,
    venueId: null,
    shouldFilterVenues: false,
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
  'Venue Gap Suggestions',
  'New Booking Details',
  'Preview New Booking',
];
