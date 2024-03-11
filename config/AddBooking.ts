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
  booking: [],
  barringConflicts: [],
};

export const Actions = {
  UPDATE_FORM_DATA: 'UPDATE_FORM_DATA',
  UPDATE_BOOKING_CONFLICTS: 'UPDATE_BOOKING_CONFLICTS',
  UPDATE_BOOKING: 'UPDATE_BOOKING',
  UPDATE_BARRED_VENUES: 'UPDATE_BARRED_VENUES',
};

export const steps = [
  'Create New Booking',
  'Booking Conflict',
  'Barring Issue',
  'New Booking Details',
  'Preview New Booking',
  'Check Mileage',
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

export const OTHER_DAY_TYPES = [
  {
    text: 'Performance',
    value: -2,
  },
  {
    text: 'Rehearsal',
    value: -3,
  },
  {
    text: 'Get in / Fit Up',
    value: -4,
  },
  {
    text: 'Get Out',
    value: -5,
  },
];

export const DEFAULT_GAP_SUGGEST_FORM_STATE = {
  minFromLastVenue: null,
  maxFromLastVenue: null,
  maxTravelTimeFromLastVenue: '',
  minToNextVenue: null,
  maxToNextVenue: null,
  maxTravelTimeToNextVenue: '',
  minSeats: null,
  includeExcludedVenues: false,
};
export const DayTypeEdit = {};
