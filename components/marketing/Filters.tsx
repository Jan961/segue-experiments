import { useMemo, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { filterState } from 'state/booking/filterState';
import { productionJumpState } from 'state/booking/productionJumpState';
import Button from 'components/core-ui-lib/Button';
import GlobalToolbar from 'components/toolbar';
import Select from 'components/core-ui-lib/Select';
import Iframe from 'components/core-ui-lib/Iframe';
import { mapBookingsToProductionOptions } from 'mappers/productionCodeMapper';
import { bookingJumpState } from 'state/marketing/bookingJumpState';
import MarketingButtons from './MarketingButtons';
import formatInputDate from 'utils/dateInputFormat';

const Filters = () => {
  const [filter, setFilter] = useRecoilState(filterState);
  const { selected: ProductionId } = useRecoilValue(productionJumpState);
  const [bookingJump, setBookingJump] = useRecoilState(bookingJumpState);
  const [venueUrl, setVenueUrl] = useState('');
  const today = formatInputDate(new Date());
  const [selectedIndex, setSelIndex] = useState(-1);
  const [selectedValue, setSelectedValue] = useState(null);
  const [venueName, setVenueName] = useState('');
  const [venueId, setVenueId] = useState(0);
  const bookingOptions = useMemo(
    () => (bookingJump.bookings ? mapBookingsToProductionOptions(bookingJump.bookings) : []),
    [bookingJump],
  );

  const todayOnSchedule = useMemo(
    () => {
      const todaysBookings = bookingOptions.filter(booking => booking.date === today);
      return todaysBookings.length === 0 ? false : true;
    }, [bookingOptions]);

    

    const changeBooking = (value: string | number) => {
      const selectedBooking = bookingOptions.find(booking => booking.value === value);
      setSelIndex(bookingOptions.findIndex(booking => booking.value === value));
      setSelectedValue(selectedBooking.value.toString());

      const bookingIdentifier = typeof value === 'string' ? parseInt(value) : value; 
      const booking = bookingJump.bookings.find(booking => booking.Id === bookingIdentifier);
      const website = booking.Venue.Website;
      setVenueName(booking.Venue.Code + ' ' + booking.Venue.Name);
      setVenueId(booking.Venue.Id);
      setVenueUrl(website);
    };

    const goToToday = () => {
      const todaysBooking = bookingOptions.find(booking => booking.date === today);
      changeBooking(todaysBooking.value);
    };


  const goToPrevious = () => {
    const prevIndex = selectedIndex - 1;
    const prevBooking = bookingOptions[prevIndex];
    changeBooking(prevBooking.value);
  }

  const goToNext = () => {
    const nextIndex = selectedIndex + 1;
    const nextBooking = bookingOptions[nextIndex];
    changeBooking(nextBooking.value);
  }

  return (
    <div className="w-full flex items-end justify-between flex-wrap">
      <div className="flex flex-col gap-4">
        <GlobalToolbar
          searchFilter={filter.venueText}
          setSearchFilter={(venueText) => setFilter({ venueText })}
          titleClassName="text-primary-green"
          title={'Marketing'}
        />

        <div className="flex items-center gap-4">
          <Select
            onChange={changeBooking}
            value={selectedValue}
            disabled={!ProductionId}
            placeholder="Select a Venue/Date"
            className="bg-white w-[550px]"
            options={bookingOptions}
          />

          <Button
            text="Go To Today"
            disabled={!todayOnSchedule || !ProductionId}
            className="text-sm leading-8 w-[132px]"
            onClick={goToToday}
          />
          <Button
            text="Previous Date"
            disabled={selectedIndex === 0  || selectedValue === null || !ProductionId}
            className="text-sm leading-8 w-[132px]"
            onClick={goToPrevious}
          />
          <Button
            text="Next Date"
            disabled={selectedIndex === bookingOptions.length - 1 || !ProductionId}
            className="text-sm leading-8 w-[132px]"
            onClick={goToNext}
          />

          {/* Iframe placed next to buttons but in the same flex container */}
          <div className="self-end -mt-[60px]">
            <Iframe variant="xs" src={venueUrl} />
          </div>
        </div>
      </div>

      <MarketingButtons venueName={venueName} venueId={venueId}/>
    </div>
  );
};

export default Filters;
