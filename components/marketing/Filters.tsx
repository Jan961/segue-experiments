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
import { reverseDate } from './utils';
import { DATE_PATTERNS, getWeekDay } from 'services/dateService';
import { currencyState } from 'state/global/currencyState';
import axios from 'axios';
import { LastPerfDate } from 'types/MarketingTypes';
import { isNullOrEmpty } from 'utils';
import { validateUrl } from 'utils/validateUrl';

type FutureBooking = {
  hasFutureBooking: boolean;
  nextBooking: any;
};

const Filters = () => {
  const [filter, setFilter] = useRecoilState(filterState);
  const { selected: productionId } = useRecoilValue(productionJumpState);
  const [bookings, setBooking] = useRecoilState(bookingJumpState);
  const [, setCurrency] = useRecoilState(currencyState);
  const today = formatInputDate(new Date());
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedValue, setSelectedValue] = useState(null);
  const [venueName, setVenueName] = useState('');
  const [venueId, setVenueId] = useState(0);
  const [landingURL, setLandingURL] = useState('');
  const [futureBookings, setFutureBookings] = useState<FutureBooking>({ hasFutureBooking: false, nextBooking: null });
  const [lastDates, setLastDates] = useState([]);
  const [ogImage, setOgImage] = useState(null);
  const [ogTitle, setOgTitle] = useState(null);
  const [landingUrlValid, setLandingUrlValid] = useState<boolean>(false);

  const bookingOptions = useMemo(() => {
    const initialOptions = bookings.bookings ? mapBookingsToProductionOptions(bookings.bookings) : [];
    const optWithRun = initialOptions.map((option) => {
      const lastDate = lastDates?.find((x) => x.BookingId === parseInt(option.value));
      if (lastDate !== undefined) {
        const endDateDay = getWeekDay(lastDate.LastPerformanceDate, 'short');
        const endDateStr = formatInputDate(lastDate.LastPerformanceDate);
        if (option.date === endDateStr) {
          return option;
        } else {
          return {
            ...option,
            text: option.text.replace(DATE_PATTERNS.shortSlash, `$1 to ${endDateDay.toUpperCase() + ' ' + endDateStr}`),
          };
        }
      } else {
        return option;
      }
    });

    optWithRun.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return optWithRun;
  }, [bookings.bookings, lastDates]);

  const getCurrency = async (bookingId) => {
    try {
      const response = await axios.get(`/api/marketing/currency/booking/${bookingId}`);

      if (response.data && typeof response.data === 'object') {
        const currencyObject = response.data as { currency: string };
        setCurrency({ symbol: currencyObject.currency });
      }
    } catch (error) {
      console.error('Error retrieving currency:', error);
    }
  };

  const changeBooking = async (value: string | number) => {
    if (value !== null) {
      const selectedBooking = bookingOptions?.find((booking) => booking.value === value);
      setSelectedIndex(bookingOptions?.findIndex((booking) => booking.value === value));
      setSelectedValue(selectedBooking.value.toString());

      const bookingIdentifier = typeof value === 'string' ? parseInt(value) : value;
      const booking = bookings.bookings.find((booking) => booking.Id === bookingIdentifier);
      const website = booking.LandingPageURL;

      setVenueName(booking.Venue.Code + ' ' + booking.Venue.Name);
      setVenueId(booking.Venue.Id);
      setLandingURL(website);
      await getCurrency(bookingIdentifier.toString());
      setBooking({ ...bookings, selected: bookingIdentifier });
    } else {
      setSelectedIndex(-1);
      setSelectedValue(null);
      setBooking({ ...bookings, selected: null });
    }
  };

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

  const fetchLastDates = async () => {
    if (!productionId) return;

    try {
      const { data } = await axios(`/api/performances/lastDate/${productionId}`);

      if (typeof data === 'object') {
        const lastDates = data as Array<LastPerfDate>;
        setLastDates(lastDates);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getOpenGraphInfo = async () => {
      try {
        const response = await axios.post('/api/marketing/open-graph-info/read', { url: landingURL });
        const result = await response.data;
        const { ogImage, ogTitle } = result;
        if (!isNullOrEmpty(ogImage)) {
          setOgImage(ogImage);
          setOgTitle(ogTitle);
        }
      } catch (exception) {
        //  If you print the exceptions here then it will give an error whenever this isnt an image preview
      }
    };

    setOgImage(null);

    const urlValid = validateUrl(landingURL);
    setLandingUrlValid(urlValid);
    if (!isNullOrEmpty(landingURL) && urlValid) getOpenGraphInfo();
  }, [landingURL]);

  useEffect(() => {
    fetchLastDates();
    setSelectedIndex(-1);
    setSelectedValue(null);
    setVenueName('');
    setVenueId(0);
    setLandingURL('');
  }, [productionId]);

  useEffect(() => {
    const futureBookings = bookingOptions?.filter((booking) => {
      const reversedBookingDate = reverseDate(booking.date);
      const reversedTodayDate = reverseDate(today);

      if (reversedBookingDate !== '' && reversedTodayDate !== '') {
        return reversedBookingDate.getTime() >= reversedTodayDate.getTime();
      } else {
        return false;
      }
    });

    setFutureBookings({
      hasFutureBooking: futureBookings?.length > 0,
      nextBooking: futureBookings?.length > 0 ? futureBookings[0] : null,
    });
  }, [bookingOptions, today]);

  return (
    <div className="w-full flex items-end justify-between flex-wrap">
      <div className="flex flex-col mb-4">
        <GlobalToolbar
          searchFilter={filter.venueText}
          setSearchFilter={(venueText) => setFilter({ venueText })}
          titleClassName="text-primary-green"
          title="Marketing"
        />

        <div className="flex items-center gap-4 mt-1">
          <Select
            testId="selectBooking"
            onChange={changeBooking}
            value={selectedValue}
            disabled={!productionId}
            placeholder="Select a Venue/Date"
            className="bg-white w-[550px]"
            options={bookingOptions}
            isClearable
            isSearchable
            key={productionId}
          />

          <Button
            text="Go To Today"
            disabled={!futureBookings.hasFutureBooking || !productionId}
            className="text-sm leading-8 w-[132px]"
            onClick={goToToday}
            testId="btnGoToToday"
          />
          <Button
            text="Previous Date"
            disabled={selectedIndex === 0 || selectedValue === null || !productionId}
            className="text-sm leading-8 w-[132px]"
            onClick={goToPrevious}
            testId="btnGoToPrev"
          />
          <Button
            text="Next Date"
            disabled={selectedIndex === bookingOptions?.length - 1 || !productionId}
            className="text-sm leading-8 w-[132px]"
            onClick={goToNext}
            testId="btnGoToNext"
          />

          {/* Iframe placed next to buttons but in the same flex container */}
          <div className=" -mt-[50px] cursor-pointer w-[150px] h-[81px]">
            {!landingUrlValid ? (
              <div className="bg-gray-300 rounded-lg h-[81px] flex items-center justify-center text-white text-sm">
                {!(landingURL?.length > 0) ? `No URL` : `Invalid URL`} provided
              </div>
            ) : isNullOrEmpty(ogImage) ? (
              <Iframe src={landingURL} variant="xs" />
            ) : (
              <a href={landingURL} target="_blank" rel="noreferrer">
                <img src={ogImage.url} alt={ogTitle} key={landingURL} />
              </a>
            )}
          </div>
        </div>
      </div>

      <MarketingButtons venueName={venueName} venueId={venueId} setModalLandingURL={setLandingURL} />
    </div>
  );
};

export default Filters;
