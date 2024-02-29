import PopupModal from 'components/core-ui-lib/PopupModal';
import { useRecoilValue } from 'recoil';
import { Wizard } from 'react-use-wizard';
import { AnimatePresence } from 'framer-motion';
import NewBookingView from './views/NewBookingView';
import BookingConflictsView from './views/BookingConflictsView';
import { newBookingState } from 'state/booking/newBookingState';
import BarringIssueView from './views/BarringIssueView';
import { useMemo, useReducer } from 'react';
import reducer, { TForm } from './reducer';
import { actionSpreader } from 'utils/AddBooking';
import { Actions, INITIAL_STATE, OTHER_DAY_TYPES, steps } from 'config/AddBooking';
import { BookingWithVenueDTO } from 'interfaces';
import GapSuggestionView from './views/GapSuggestionView';
import NewBookingDetailsView from './views/NewBookingDetailsView';
import { currentProductionSelector } from 'state/booking/selectors/currentProductionSelector';
import { dateTypeState } from 'state/booking/dateTypeState';

type AddBookingProps = {
  visible: boolean;
  onClose: () => void;
  startDate?: string;
  endDate?: string;
};

const AddBooking = ({ visible, onClose, startDate, endDate }: AddBookingProps) => {
  const { stepIndex } = useRecoilValue(newBookingState);
  const handleModalClose = () => onClose?.();
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE, () => ({
    ...INITIAL_STATE,
    form: {
      ...INITIAL_STATE.form,
      fromDate: startDate,
      toDate: endDate,
    },
  }));
  const currentProduction = useRecoilValue(currentProductionSelector);
  const dayTypes = useRecoilValue(dateTypeState);
  const dayTypeOptions = useMemo(
    () => [...OTHER_DAY_TYPES, ...dayTypes.map(({ Id: value, Name: text }) => ({ text, value }))],
    [dayTypes],
  );

  const productionCode = useMemo(
    () =>
      currentProduction
        ? `${currentProduction?.ShowCode}${currentProduction?.Code} ${currentProduction?.ShowName}`
        : 'All',
    [currentProduction],
  );

  const onFormDataChange = (change: Partial<TForm>) => {
    dispatch(actionSpreader(Actions.UPDATE_FORM_DATA, change));
  };
  const updateBookingConflicts = (bookingConflicts: BookingWithVenueDTO[]) => {
    dispatch(actionSpreader(Actions.UPDATE_BOOKING_CONFLICTS, bookingConflicts));
  };
  return (
    <>
      <PopupModal
        show={visible}
        onClose={handleModalClose}
        titleClass="text-xl text-primary-navy text-bold"
        title={steps[stepIndex]}
        panelClass="relative"
      >
        <Wizard wrapper={<AnimatePresence initial={false} mode="wait" />}>
          <NewBookingView
            updateBookingConflicts={updateBookingConflicts}
            dayTypeOptions={dayTypeOptions}
            onChange={onFormDataChange}
            formData={state.form}
            onClose={onClose}
            productionCode={productionCode}
          />
          <BookingConflictsView data={state.bookingConflicts} />
          <BarringIssueView bookingConflicts={state.bookingConflicts} />
          <NewBookingDetailsView
            formData={state.form}
            productionCode={productionCode}
            dayTypeOptions={dayTypeOptions}
          />
          <div>Preview booking</div>
          <GapSuggestionView startDate={state.form.fromDate} endDate={state.form.toDate} />
        </Wizard>
      </PopupModal>
    </>
  );
};

export default AddBooking;
