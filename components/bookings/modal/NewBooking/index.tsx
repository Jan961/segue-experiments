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
import { Actions, INITIAL_STATE } from 'config/AddBooking';

const steps = ['Create New Booking', 'Booking Conflict', 'Barring Issue', 'New Booking Details', 'Preview New Booking'];

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
  return (
    <>
      <PopupModal show={visible} onClose={handleModalClose} title={steps[stepIndex]}>
        <Wizard wrapper={<AnimatePresence initial={false} mode="wait" />}>
          <NewBookingView onChange={onFormDataChange} formData={state.form} onClose={() => null} />
          <BookingConflictsView formData={state.form} steps={steps} />
          <BarringIssueView />
        </Wizard>
      </PopupModal>
    </>
  );
};

export default AddBooking;
