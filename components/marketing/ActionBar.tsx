import { useMemo, useState } from 'react';
import { ToolbarButton } from 'components/bookings/ToolbarButton';
import moment from 'moment';
import { useRecoilState } from 'recoil';
import { bookingJumpState } from 'state/marketing/bookingJumpState';

import Typeahead, { TypeaheadOption } from 'components/global/Typeahead';
import { mapBookingsToTourOptions } from 'mappers/tourCodeMapper';

const ActionBar = () => {
  const [bookingJump, setBookingJump] = useRecoilState(bookingJumpState);
  const bookingOptions = useMemo(
    () => (bookingJump.bookings ? mapBookingsToTourOptions(bookingJump.bookings) : []),
    [bookingJump],
  );
  const [selectedBooking, setSelectedBooking] = useState<TypeaheadOption>();
  const selectedBookingIndex = useMemo(
    () => bookingOptions.findIndex((booking) => parseInt(booking.value, 10) === bookingJump.selected),
    [bookingJump.selected, bookingOptions],
  );
  const changeBooking = (booking: TypeaheadOption) => {
    setSelectedBooking(booking);
    setBookingJump({ ...bookingJump, selected: Number(booking.value) });
  };

  const goToToday = () => {
    const currentDate = moment();
    const sortedBookings = bookingOptions.sort((a, b) => {
      const distA = Math.abs(currentDate.diff(moment(a.date, 'DD/MM/YYYY'), 'days'));
      const distB = Math.abs(currentDate.diff(moment(b.date, 'DD/MM/YYYY'), 'days'));
      return distA - distB;
    });
    const closestDateBooking = sortedBookings[0];
    const selected = Number(closestDateBooking.value);
    setBookingJump({ ...bookingJump, selected });
  };
  const previousVenue = () => {
    const selected = Number(bookingOptions[selectedBookingIndex - 1]?.value);
    setBookingJump({ ...bookingJump, selected });
  };
  const nextVenue = () => {
    const selected = Number(bookingOptions[selectedBookingIndex + 1]?.value);
    setBookingJump({ ...bookingJump, selected });
  };

  return (
    <div className="grid grid-cols-6 gap-3 mt-3 max-w-full items-center">
      <div className="col-span-6 flex grid-cols-5 gap-2 items-center">
        <Typeahead className="w-128" value={selectedBooking} options={bookingOptions} onChange={changeBooking} />
        <ToolbarButton onClick={goToToday} className="!text-primary-green">
          Today
        </ToolbarButton>
        <ToolbarButton disabled={selectedBookingIndex === 0} onClick={previousVenue} className="!text-primary-green">
          Previous
        </ToolbarButton>
        <ToolbarButton
          disabled={selectedBookingIndex === bookingOptions?.length - 1}
          onClick={nextVenue}
          className="!text-primary-green"
        >
          Next
        </ToolbarButton>
      </div>
    </div>
  );
};
export default ActionBar;

// Add default props
ActionBar.defaultProps = {
  onActionBookingIdChange: () => {},
};
