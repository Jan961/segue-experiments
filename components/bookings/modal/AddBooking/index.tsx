import PopupModal from 'components/core-ui-lib/PopupModal';
import { useRecoilValue } from 'recoil';
import { Wizard } from 'react-use-wizard';
import { AnimatePresence } from 'framer-motion';
import NewBookingView from './views/NewBookingView';
import BookingConflictsView from './views/BookingConflictsView';
import { newBookingState } from 'state/booking/newBookingState';
import BarringIssueView from './views/BarringIssueView';

const steps = ['Create New Booking', 'Booking Conflict', 'Barring Issue', 'New Booking Details', 'Preview New Booking'];

type AddBookingProps = {
  visible: boolean;
  onClose: () => void;
};

const AddBooking = ({ visible }: AddBookingProps) => {
  const { stepIndex } = useRecoilValue(newBookingState);
  const handleModalClose = () => null;

  return (
    <>
      <PopupModal show={visible} onClose={handleModalClose} title={steps[stepIndex]}>
        <Wizard wrapper={<AnimatePresence initial={false} mode="wait" />}>
          <NewBookingView onClose={() => null} />
          <BookingConflictsView steps={steps} />
          <BarringIssueView />
        </Wizard>
      </PopupModal>
    </>
  );
};

export default AddBooking;
