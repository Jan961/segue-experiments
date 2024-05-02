import { Wizard } from 'react-use-wizard';
import MoveBookingView from './MoveBookingView';
import PopupModal from 'components/core-ui-lib/PopupModal';
import { useState } from 'react';
import { BookingItem } from '../NewBooking/reducer';
import { SelectOption } from 'components/core-ui-lib/Select/Select';
import BookingConflictsView from '../NewBooking/views/BookingConflictsView';
import BarringIssueView from '../NewBooking/views/BarringIssueView';
import { BookingWithVenueDTO } from 'interfaces';
import { BarredVenue } from 'pages/api/productions/venue/barringCheck';
import { useRecoilValue } from 'recoil';
import { currentProductionSelector } from 'state/booking/selectors/currentProductionSelector';
import ConfirmMoveView from './ConfirmMoveView';

interface MoveBookingProps {
  visible: boolean;
  onClose: (value?: string) => void;
  bookings: BookingItem[];
  venueOptions: SelectOption[];
}

export type MoveParams = {
  bookings: BookingItem[];
  productionName: string;
  count: string;
  venue: string;
  date: string;
};

const Header = () => {
  const currentProduction = useRecoilValue(currentProductionSelector);
  return (
    <div className="text-primary-navy text-xl my-2 font-bold">{`${currentProduction?.ShowCode}${currentProduction?.Code}  ${currentProduction?.ShowName}`}</div>
  );
};

export const moveBookingSteps = ['MoveBooking', 'Booking Conflict', 'Barring Issue', 'MoveConfirm', 'MoveSuccess'];

const MoveBooking = ({ visible, onClose, venueOptions, bookings = [] }: MoveBookingProps) => {
  const [state, setState] = useState({ barringConflicts: [], bookingConflicts: [], modalTitle: '' });
  const [moveParams, setMoveParams] = useState<MoveParams>();

  const updateModalTitle = (modalTitle: string) => {
    setState((prev) => ({ ...prev, modalTitle }));
  };

  const updateBookingConflicts = (bookingConflicts: BookingWithVenueDTO[]) => {
    setState((prev) => ({ ...prev, bookingConflicts }));
  };
  const updateBarringConflicts = (barringConflicts: BarredVenue[]) => {
    setState((prev) => ({ ...prev, barringConflicts }));
  };

  return (
    <PopupModal
      show={visible}
      onClose={onClose}
      titleClass="text-xl text-primary-navy text-bold"
      title="Move Booking"
      panelClass="relative"
    >
      <Wizard header={<Header />}>
        <MoveBookingView
          bookings={bookings}
          venueOptions={venueOptions}
          onClose={onClose}
          viewSteps={moveBookingSteps}
          updateBarringConflicts={updateBarringConflicts}
          updateBookingConflicts={updateBookingConflicts}
          updateMoveParams={setMoveParams}
        />
        <BookingConflictsView
          isNewBooking={false}
          data={state.bookingConflicts}
          updateModalTitle={updateModalTitle}
          nextStep={moveBookingSteps.indexOf(state?.barringConflicts?.length > 0 ? 'Barring Issue' : 'MoveConfirm')}
        />
        <BarringIssueView
          barringConflicts={state.barringConflicts}
          updateModalTitle={updateModalTitle}
          previousStep={moveBookingSteps.indexOf('MoveBooking')}
          nextStep={moveBookingSteps.indexOf('MoveConfirm')}
        />
        <ConfirmMoveView {...moveParams} onClose={onClose} />
      </Wizard>
    </PopupModal>
  );
};

export default MoveBooking;
