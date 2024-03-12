import { Actions, INITIAL_STATE } from 'config/AddBooking';
import { BookingWithVenueDTO } from 'interfaces';
import { BarredVenue } from 'pages/api/productions/venue/barred';
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

export type PreviewDataItem = {
  production: string;
  date: string;
  week: number;
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
export type BookingItem = {
  map(arg0: (item: any) => any): unknown;
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
};

export type TState = {
  form: TForm;
  bookingConflicts: BookingWithVenueDTO[];
  barringConflicts: BarredVenue[];
  booking: BookingItem[];
  modalTitle: string;
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
    default:
      return state;
  }
};

export default reducer;
