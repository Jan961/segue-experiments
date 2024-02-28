import { Actions, INITIAL_STATE } from 'config/AddBooking';
import { BookingWithVenueDTO } from 'interfaces';

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

export type PreviewDataItem = {
  production: string;
  date: string;
  week: string;
  venue: number;
  town: string;
  perf: boolean;
  dayType: string;
  bookingStatus: string;
  capacity: number;
  noPerf: number;
  perfTimes: string;
  miles: string;
  travelTime: string;
};

export type TState = {
  form: TForm;
  bookingConflicts: BookingWithVenueDTO[];
};

const reducer = (state: TState = INITIAL_STATE, action: TAction) => {
  const { payload = {}, type } = action;
  const { form } = state;
  console.log(type, payload);
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
    default:
      return state;
  }
};

export default reducer;
