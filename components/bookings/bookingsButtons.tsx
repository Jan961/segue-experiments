import Barring from './modal/barring';
import Button from 'components/core-ui-lib/Button';
import AddBooking from './modal/NewBooking';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { currentProductionSelector } from 'state/booking/selectors/currentProductionSelector';
import Tooltip from 'components/core-ui-lib/Tooltip';
import { productionJumpState } from 'state/booking/productionJumpState';

export default function BookingsButtons() {
  const [showAddNewBookingModal, setShowAddNewBookingModal] = useState<boolean>(false);
  const [showBarringModal, setShowBarringModal] = useState<boolean>(false);
  const [bookingsDisabled, setBookingsDisabled] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);
  const production = useRecoilValue(currentProductionSelector);
  const { selected: ProductionId } = useRecoilValue(productionJumpState);

  useEffect(() => {
    if (production === undefined || production.IsArchived === true) {
      setBookingsDisabled(true);
    } else {
      setBookingsDisabled(false);
    }

    if (!ProductionId) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [production, ProductionId]);

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-4">
      <Tooltip
        body="Please select a current Production"
        position="left"
        width="w-44"
        // disable tooltip when Production Dropdown = "Please select a production"
        manualToggle={!ProductionId ? false : bookingsDisabled}
        useManualToggle={!ProductionId ? true : !bookingsDisabled}
      >
        <Button
          disabled={bookingsDisabled}
          text="Create New Booking"
          className="w-[155px]"
          onClick={() => setShowAddNewBookingModal(true)}
        ></Button>
      </Tooltip>
      <Button
        disabled={disabled}
        text="Booking Reports"
        className="w-[155px]"
        iconProps={{ className: 'h-4 w-3' }}
        sufixIconName={'excel'}
      ></Button>
      <Button disabled={disabled} text="Venue History" className="w-[155px]"></Button>

      <Button
        disabled={disabled}
        text="Barring Check"
        className="w-[155px]"
        onClick={() => setShowBarringModal(true)}
      ></Button>

      {showBarringModal && <Barring visible={showBarringModal} onClose={() => setShowBarringModal(false)} />}
      {showAddNewBookingModal && (
        <AddBooking visible={showAddNewBookingModal} onClose={() => setShowAddNewBookingModal(false)} />
      )}
    </div>
  );
}
