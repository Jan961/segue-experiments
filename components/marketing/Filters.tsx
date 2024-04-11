import { useEffect, useMemo, useState } from 'react';
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

type FutureBooking = {
  hasFutureBooking: boolean;
  nextBooking: any;
};

const Filters = () => {
  const [filter, setFilter] = useRecoilState(filterState);
  const { selected: productionId } = useRecoilValue(productionJumpState);
  const [bookings, setBooking] = useRecoilState(bookingJumpState);
  const today = formatInputDate(new Date());
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedValue, setSelectedValue] = useState(null);
  const [venueName, setVenueName] = useState('');
  const [venueId, setVenueId] = useState(0);
  const [venueUrl, setVenueUrl] = useState('');
  const [futureBookings, setFutureBookings] = useState<FutureBooking>({ hasFutureBooking: false, nextBooking: null });
  const bookingOptions = useMemo(() => {
    const options = bookings.bookings ? mapBookingsToProductionOptions(bookings.bookings) : [];
    options.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return options;
  }, [bookings]);

  useEffect(() => {
    if (bookings.selected !== null && bookings.selected !== undefined) {
      changeBooking(bookings.selected.toString());
    }
  }, [bookings.bookings]);

  useEffect(() => {
    const futureBookings = bookingOptions
      .map((booking) => ({
        ...booking,
        parsedDate: parseDate(booking.date),
      }))
      .filter((booking) => booking.parsedDate >= parseDate(today));

    setFutureBookings({
      hasFutureBooking: futureBookings.length > 0,
      nextBooking: futureBookings.length > 0 ? futureBookings[0] : null,
    });
  }, [bookingOptions]);

  const changeBooking = (value: string | number) => {
    if (value !== null) {
      const selectedBooking = bookingOptions.find((booking) => booking.value === value);
      setSelectedIndex(bookingOptions.findIndex((booking) => booking.value === value));
      setSelectedValue(selectedBooking.value.toString());

      const bookingIdentifier = typeof value === 'string' ? parseInt(value) : value;
      const booking = bookings.bookings.find((booking) => booking.Id === bookingIdentifier);
      const website = booking.Venue.Website;
      setVenueName(booking.Venue.Code + ' ' + booking.Venue.Name);
      setVenueId(booking.Venue.Id);
      setVenueUrl(website);
      setBooking({ ...bookings, selected: bookingIdentifier });
    } else {
      setSelectedIndex(-1);
      setSelectedValue(0);
      setBooking({ ...bookings, selected: null });
    }
  };

  const parseDate = (inputDt) => new Date(inputDt.split('/').reverse().join('/')).getTime();

  const goToToday = () => {
    if (futureBookings.hasFutureBooking) {
      changeBooking(futureBookings.nextBooking.value);
    }
  };

  const goToPrevious = () => {
    const prevIndex = selectedIndex - 1;
    const prevBooking = bookingOptions[prevIndex];
    changeBooking(prevBooking.value);
  };

  const goToNext = () => {
    const nextIndex = selectedIndex + 1;
    const nextBooking = bookingOptions[nextIndex];
    changeBooking(nextBooking.value);
  };

  return (
    <div className="w-full flex items-end justify-between flex-wrap">
      <div className="flex flex-col mb-4">
        <GlobalToolbar
          searchFilter={filter.venueText}
          setSearchFilter={(venueText) => setFilter({ venueText })}
          titleClassName="text-primary-green"
          title={'Marketing'}
        />

        <div className="flex items-center gap-4 mt-1">
          <Select
            onChange={changeBooking}
            value={selectedValue}
            disabled={!productionId}
            placeholder="Select a Venue/Date"
            className="bg-white w-[550px]"
            options={bookingOptions}
            isClearable
            isSearchable
          />

          <Button
            text="Go To Today"
            disabled={!futureBookings.hasFutureBooking || !productionId}
            className="text-sm leading-8 w-[132px]"
            onClick={goToToday}
          />
          <Button
            text="Previous Date"
            disabled={selectedIndex === 0 || selectedValue === null || !productionId}
            className="text-sm leading-8 w-[132px]"
            onClick={goToPrevious}
          />
          <Button
            text="Next Date"
            disabled={selectedIndex === bookingOptions.length - 1 || !productionId}
            className="text-sm leading-8 w-[132px]"
            onClick={goToNext}
          />

          {/* Iframe placed next to buttons but in the same flex container */}
          <div className="self-end -mt-[60px]">
            <Iframe variant="xs" src={venueUrl} className="" />
          </div>
        </div>
      </div>

      <MarketingButtons venueName={venueName} venueId={venueId} />
    </div>
  );
};

export default Filters;
