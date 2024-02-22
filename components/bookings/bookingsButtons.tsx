import Barring from './modal/barring';
import Button from 'components/core-ui-lib/Button';
import AddBooking from './modal/NewBooking';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { currentProductionSelector } from 'state/booking/selectors/currentProductionSelector';
import Tooltip from 'components/core-ui-lib/Tooltip';
import { productionJumpState } from 'state/booking/productionJumpState';

export default function BookingsButtons() {
  const [showAddNewBookingModal, setShowAddNewBookingModal] = useState(false);
  const [showBarringModal, setShowBarringModal] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [disableTooltip, setDisableTooltip] = useState(true);
  const { productions } = useRecoilValue(productionJumpState);
  const production = useRecoilValue(currentProductionSelector);

  useEffect(() => {
    console.log(productions);
    // console.log({production, ProductionId, path })
    if (production === undefined || production.IsArchived === true) {
      setBtnDisabled(true);
      setDisableTooltip(false);
    } else {
      setBtnDisabled(false);
    }
  }, [production]);

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-4">
      <Tooltip
        body="Please select a current Production"
        position="left"
        width="w-44"
        useManualToggle={disableTooltip}
        manualToggle={!disableTooltip}
      >
        <Button
          disabled={btnDisabled}
          text="Create New Booking"
          className="w-[155px]"
          onClick={() => setShowAddNewBookingModal(true)}
        ></Button>
      </Tooltip>
      <Button
        disabled={btnDisabled}
        text="Booking Reports"
        className="w-[155px]"
        iconProps={{ className: 'h-4 w-3' }}
        sufixIconName={'excel'}
      ></Button>
      <Button disabled={btnDisabled} text="Venue History" className="w-[155px]"></Button>

      <Button
        disabled={btnDisabled}
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
