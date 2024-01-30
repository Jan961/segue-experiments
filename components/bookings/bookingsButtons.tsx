// import BookingSchedule from './modal/BookingSchedule';
// import ScheduleReport from './modal/ScheduleReport';
import Barring from './modal/barring';
// import Report from './modal/Report';
import Button from 'components/core-ui-lib/Button';
import AddBooking from './modal/AddBooking';
import { useState } from 'react';

export default function BookingsButtons() {
  const [showAddNewBookingModal, setShowAddNewBookingModal] = useState(false);
  const [showBarringModal, setShowBarringModal] = useState(false);
  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-4">
      <Button text="Venue History"></Button>
      <Button text="Booking Reports" iconProps={{ className: 'h-4 w-3' }} sufixIconName={'excel'}></Button>
      {/* <BookingSchedule TourId={currentTourId} /> */}
      {/* <ScheduleReport TourId={currentTourId} /> */}
      <Button text="Check Barring" onClick={() => setShowBarringModal(true)}></Button>
      <Button text="Create New Booking" onClick={() => setShowAddNewBookingModal(true)}></Button>
      {showBarringModal && <Barring visible={showBarringModal} onClose={() => setShowBarringModal(false)} />}
      {showAddNewBookingModal && (
        <AddBooking visible={showAddNewBookingModal} onClose={() => setShowAddNewBookingModal(false)} />
      )}
    </div>
  );
}
