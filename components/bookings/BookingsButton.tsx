import Barring from './modal/Barring';
import Button from 'components/core-ui-lib/Button';
import { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { currentProductionSelector } from 'state/booking/selectors/currentProductionSelector';
import Tooltip from 'components/core-ui-lib/Tooltip';
import { productionJumpState } from 'state/booking/productionJumpState';
import { BookingReports } from './modal/BookingReports';
import { VenueHistory } from './modal/VenueHistory';
import { addEditBookingState } from 'state/booking/bookingState';

interface BookingsButtonProps {
  onExportClick: () => void;
}

export default function BookingsButtons({ onExportClick }: BookingsButtonProps) {
  const [showBarringModal, setShowBarringModal] = useState<boolean>(false);
  const [bookingsDisabled, setBookingsDisabled] = useState<boolean>(false);
  const [showBookingReportsModal, setShowBookingReportsModal] = useState<boolean>();
  const [showVenueHistory, setShowVenueHistory] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);
  const production = useRecoilValue(currentProductionSelector);
  const { selected: ProductionId } = useRecoilValue(productionJumpState);
  const setAddNewBookingModalVisible = useSetRecoilState(addEditBookingState);

  useEffect(() => {
    setBookingsDisabled(production === undefined || production.IsArchived === true);
    setDisabled(!ProductionId);
  }, [production, ProductionId]);

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-4">
      <Tooltip
        body="Please select a current Production"
        position="left"
        width="w-44"
        disabled={!ProductionId ? true : !bookingsDisabled}
      >
        <Button
          disabled={bookingsDisabled}
          text="Create New Booking"
          className="w-[155px]"
          onClick={() => setAddNewBookingModalVisible({ visible: true, startDate: null, endDate: null })}
        />
      </Tooltip>
      <Button
        disabled={disabled}
        text="Booking Reports"
        className="w-[155px]"
        iconProps={{ className: 'h-4 w-3' }}
        sufixIconName="excel"
        onClick={() => setShowBookingReportsModal(true)}
      />
      <Button onClick={() => setShowVenueHistory(true)} text="Venue History" className="w-[155px]" />

      <Button
        disabled={disabled}
        text="Barring Check"
        className="w-[155px]"
        onClick={() => setShowBarringModal(true)}
      />

      {showBarringModal && <Barring visible={showBarringModal} onClose={() => setShowBarringModal(false)} />}

      {showBookingReportsModal && (
        <BookingReports
          onExportClick={onExportClick}
          visible={showBookingReportsModal}
          onClose={() => setShowBookingReportsModal(false)}
        />
      )}
      {showVenueHistory && <VenueHistory visible={showVenueHistory} onCancel={() => setShowVenueHistory(false)} />}
    </div>
  );
}
