export const INITIAL_STATE = {
  form: {
    fromDate: '',
    toDate: '',
    isDateTypeOnly: false,
    dateType: null,
    venueId: null,
    shouldFilterVenues: true,
    isRunOfDates: true,
  },
  bookingConflicts: [],
  booking: [],
  bookingUpdates: [],
  barringConflicts: [],
  modalTitle: '',
  barringNextStep: '',
};

export const Actions = {
  UPDATE_FORM_DATA: 'UPDATE_FORM_DATA',
  UPDATE_BOOKING_CONFLICTS: 'UPDATE_BOOKING_CONFLICTS',
  SET_BOOKING: 'SET_BOOKING',
  UPDATE_BOOKING: 'UPDATE_BOOKING',
  UPDATE_BARRED_VENUES: 'UPDATE_BARRED_VENUES',
  UPDATE_MODAL_TITLE: 'UPDATE_MODAL_TITLE',
  SET_BARRING_NEXT_STEP: 'SET_BARRING_NEXT_STEP',
};

export const newBookingSteps = [
  'Create New Booking',
  'New Booking Details',
  'Preview New Booking',
  'Check Mileage',
  'Booking Conflict',
  'Barring Issue',
  'Venue Gap Suggestions',
];

export const editBookingSteps = [
  'New Booking Details',
  'Preview New Booking',
  'Check Mileage',
  'Booking Conflict',
  'Barring Issue',
];

export const getStepIndex = (isNewBooking: boolean, step: string) => {
  const stepIndex = isNewBooking ? newBookingSteps.indexOf(step) : editBookingSteps.indexOf(step);
  return stepIndex === -1 ? 0 : stepIndex;
};

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
];

export const DEFAULT_GAP_SUGGEST_FORM_STATE = {
  minFromLastVenue: '25',
  maxFromLastVenue: '125',
  maxTravelTimeFromLastVenue: '3',
  minToNextVenue: '25',
  maxToNextVenue: '125',
  maxTravelTimeToNextVenue: '3',
  minSeats: '400',
  maxSeats: '2500',
  includeExcludedVenues: false,
};
export const DayTypeEdit = {};
