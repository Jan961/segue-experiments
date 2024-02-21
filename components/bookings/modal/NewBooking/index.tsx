import PopupModal from 'components/core-ui-lib/PopupModal';
import { useRecoilValue } from 'recoil';
import { Wizard } from 'react-use-wizard';
import { AnimatePresence } from 'framer-motion';
import NewBookingView from './views/NewBookingView';
import BookingConflictsView from './views/BookingConflictsView';
import { newBookingState } from 'state/booking/newBookingState';
import BarringIssueView from './views/BarringIssueView';
import { useReducer } from 'react';
import reducer, { TForm } from './reducer';
import { actionSpreader } from 'utils/AddBooking';
import { Actions, INITIAL_STATE, steps } from 'config/AddBooking';
import { BookingWithVenueDTO } from 'interfaces';
import GapSuggestionView from './views/GapSuggestionView';
import NewBookingDetails from './views/NewBookingDetails';

type AddBookingProps = {
  visible: boolean;
  onClose: () => void;
};

const AddBooking = ({ visible, onClose }: AddBookingProps) => {
  const { stepIndex } = useRecoilValue(newBookingState);
  const handleModalClose = () => onClose?.();
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
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
      >
        <Wizard wrapper={<AnimatePresence initial={false} mode="wait" />}>
          <NewBookingView
            updateBookingConflicts={updateBookingConflicts}
            onChange={onFormDataChange}
            formData={state.form}
            onClose={onClose}
          />

          <BookingConflictsView data={state.bookingConflicts} />
          <BarringIssueView />
          <NewBookingDetails data={state.form} />
          <GapSuggestionView startDate={state.form.fromDate} endDate={state.form.toDate} />
        </Wizard>
      </PopupModal>
    </>
  );
};

export default AddBooking;
