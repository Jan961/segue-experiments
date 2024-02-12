import { Actions, INITIAL_STATE } from 'config/AddBooking';

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
};

export type TState = {
  form: TForm;
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
    default:
      return state;
  }
};

export default reducer;
