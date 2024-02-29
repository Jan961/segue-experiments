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
};

export const Actions = {
  UPDATE_FORM_DATA: 'UPDATE_FORM_DATA',
  UPDATE_BOOKING_CONFLICTS: 'UPDATE_BOOKING_CONFLICTS',
  UPDATE_BOOKING: 'UPDATE_BOOKING',
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

export const OTHER_DAY_TYPES = [
  {
    text: 'Performance',
    value: -1,
  },
  {
    text: 'Rehearsal',
    value: -2,
  },
  {
    text: 'Get in / Fit Up',
    value: -3,
  },
  {
    text: 'Get Out',
    value: -4,
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
  excludeLondonVenues: false,
};
export const DayTypeEdit = {};
