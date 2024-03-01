import { Actions, INITIAL_STATE } from 'config/AddBooking';
import { BookingWithVenueDTO } from 'interfaces';
import { debug } from 'utils/logging';

export type TAction = {
  type: string;
  payload: any;
};

export type TForm = {
  fromDate?: string;
  toDate?: string;
  isDateTypeOnly?: boolean;
  venueId?: number;
  dateType?: number;
  shouldFilterVenues?: boolean;
  isRunOfDates?: boolean;
};

export type BookingItem = {
  date: string;
  perf: boolean;
  dayType: number;
  venue: number;
  noPerf: number;
  times: string;
  bookingStatus: string;
  pencilNo: string;
  notes: string;
  isBooking: boolean;
  isRehearsal: boolean;
  isGetInFitUp: boolean;
};

export type TState = {
  form: TForm;
  bookingConflicts: BookingWithVenueDTO[];
  booking: BookingItem[];
};

const reducer = (state: TState = INITIAL_STATE, action: TAction) => {
  const { payload = {}, type } = action;
  const { form } = state;
  debug(type, payload);
  switch (type) {
    case Actions.UPDATE_FORM_DATA:
      return {
        ...state,
        form: {
          ...form,
          ...payload,
        },
      };
    case Actions.UPDATE_BOOKING_CONFLICTS:
      return {
        ...state,
        bookingConflicts: payload,
      };
    case Actions.UPDATE_BOOKING:
      return {
        ...state,
        booking: payload,
      };
    default:
      return state;
  }
};

export default reducer;
