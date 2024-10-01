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

export type BarredVenue = {
  Id: number;
  Name: string;
  Code: string;
  StatusCode: string;
  Mileage: number;
  TimeMins: number;
  BookingId: number;
  Date: string;
  town: string;
};

export type BookingItem = {
  id?: string;
  date: string | Date;
  dateBlockId: number;
  dateAsISOString: string;
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
  isRunOfDates: boolean;
  runTag?: string;
};

export type PreviewDataItem = {
  production: string;
  date: string | Date;
  week: number;
  venue: string;
  town: string;
  perf: boolean;
  dayType: string;
  bookingStatus: string;
  capacity: string;
  noPerf: number;
  perfTimes: string;
  miles: string;
  travelTime: string;
  highlightRow?: boolean;
  item: BookingItem;
};

export type TState = {
  form: TForm;
  bookingConflicts: BookingWithVenueDTO[];
  barringConflicts: BarredVenue[];
  booking: BookingItem[];
  bookingUpdates: BookingItem[];
  modalTitle: string;
  barringNextStep: string;
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
    case Actions.SET_BOOKING:
      return {
        ...state,
        booking: payload,
      };
    case Actions.UPDATE_BOOKING:
      return {
        ...state,
        bookingUpdates: payload,
      };
    case Actions.UPDATE_BARRED_VENUES:
      return {
        ...state,
        barringConflicts: payload,
      };
    case Actions.UPDATE_MODAL_TITLE:
      return {
        ...state,
        modalTitle: payload,
      };
    case Actions.SET_BARRING_NEXT_STEP:
      return {
        ...state,
        barringNextStep: payload,
      };
    default:
      return state;
  }
};

export default reducer;
