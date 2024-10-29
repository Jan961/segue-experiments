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
import { accessBookingsHome } from 'state/account/selectors/permissionSelector';

interface BookingsButtonProps {
  onExportClick: (key: string) => void;
}

export default function BookingsButtons({ onExportClick }: BookingsButtonProps) {
  const permissions = useRecoilValue(accessBookingsHome);
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
    <div className="grid grid-cols-2 grid-rows-2 gap-3 mt-2.5">
      <Tooltip
        body="Please select a current Production"
        position="left"
        width="w-44"
        disabled={!ProductionId ? true : !bookingsDisabled}
      >
        <Button
          testId="booking-filters-create-new-booking"
          disabled={bookingsDisabled || disabled || !permissions.includes('CREATE_NEW_BOOKING')}
          text="Create New Booking"
          className="w-[155px]"
          onClick={() => setAddNewBookingModalVisible({ visible: true, startDate: null, endDate: null })}
        />
      </Tooltip>

      <Button
        testId="booking-filters-booking-reports"
        disabled={disabled || !permissions.includes('ACCESS_BOOKING_REPORTS')}
        text="Booking Reports"
        className="w-[155px]"
        iconProps={{ className: 'h-4 w-3' }}
        sufixIconName="excel"
        onClick={() => setShowBookingReportsModal(true)}
      />

      <Button
        testId="booking-filters-venue-history"
        onClick={() => setShowVenueHistory(true)}
        text="Venue History"
        disabled={!permissions.includes('ACCESS_VENUE_HISTORY')}
        className="w-[155px] mt-0.5"
      />

      <Button
        testId="booking-filters-barring-check"
        disabled={disabled || !permissions.includes('ACCESS_BARRING_CHECK')}
        text="Barring Check"
        className="w-[155px] mt-0.5"
        onClick={() => setShowBarringModal(true)}
      />

      {showBarringModal && <Barring visible={showBarringModal} onClose={() => setShowBarringModal(false)} />}

      {showBookingReportsModal && (
        <BookingReports
          productionId={ProductionId}
          onExportClick={onExportClick}
          visible={showBookingReportsModal}
          onClose={() => setShowBookingReportsModal(false)}
        />
      )}
      {showVenueHistory && <VenueHistory visible={showVenueHistory} onCancel={() => setShowVenueHistory(false)} />}
    </div>
  );
}
