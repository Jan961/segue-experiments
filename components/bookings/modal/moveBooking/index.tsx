import { Wizard } from 'react-use-wizard';
import MoveBookingView from './MoveBookingView';
import PopupModal from 'components/core-ui-lib/PopupModal';
import { useState } from 'react';
import { BookingItem } from '../NewBooking/reducer';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import BookingConflictsView from '../NewBooking/views/BookingConflictsView';
import BarringIssueView from '../NewBooking/views/BarringIssueView';

interface MoveBookingProps {
  visible: boolean;
  onClose: () => void;
  bookings: BookingItem[];
  venueOptions: SelectOption[];
}

const MoveBooking = ({ visible, onClose, venueOptions, bookings = [] }: MoveBookingProps) => {
  const [state, setState] = useState({ barringConflicts: [], bookingConflicts: [], modalTitle: '' });
  const [hasOverlay, setHasOverlay] = useState<boolean>(false);

  const updateModalTitle = (modalTitle: string) => {
    setState((prev) => ({ ...prev, modalTitle }));
  };
  return (
    <PopupModal
      show={visible}
      onClose={() => onClose()}
      titleClass="text-xl text-primary-navy text-bold"
      title="Move Booking"
      panelClass="relative"
      hasOverlay={hasOverlay}
    >
      <Wizard>
        <MoveBookingView bookings={bookings} venueOptions={venueOptions} onClose={onClose} />
        <BookingConflictsView
          isNewBooking={false}
          hasBarringIssues={state?.barringConflicts?.length > 0}
          data={state.bookingConflicts}
          updateModalTitle={updateModalTitle}
        />
        <BarringIssueView
          isNewBooking={false}
          barringConflicts={state.barringConflicts}
          updateModalTitle={updateModalTitle}
          nextStep=""
        />
      </Wizard>
    </PopupModal>
  );
};

export default MoveBooking;
