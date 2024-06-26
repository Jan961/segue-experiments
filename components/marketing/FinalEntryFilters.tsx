import { useEffect, useMemo, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { productionJumpState } from 'state/booking/productionJumpState';
import Select from 'components/core-ui-lib/Select';
import { mapBookingsToProductionOptions } from 'mappers/productionCodeMapper';
import { bookingJumpState } from 'state/marketing/bookingJumpState';
import { ProductionJumpMenu } from 'components/global/nav/ProductionJumpMenu';
import useAxios from 'hooks/useAxios';
import { getWeekDayShort } from 'services/dateService';
import formatInputDate from 'utils/dateInputFormat';
import { LastPerfDate } from 'pages/api/marketing/sales/tourWeeks/[ProductionId]';
import { currencyState } from 'state/marketing/currencyState';
import axios from 'axios';
import { DATE_PATTERN } from 'components/shows/constants';

const FinalEntryFilters = () => {
  const { selected: productionId } = useRecoilValue(productionJumpState);
  const [bookings, setBooking] = useRecoilState(bookingJumpState);
  const [selectedValue, setSelectedValue] = useState(null);
  const [lastDates, setLastDates] = useState([]);
  const [, setCurrency] = useRecoilState(currencyState);

  const { fetchData } = useAxios();

  const getCurrency = async (bookingId) => {
    try {
      const response = await axios.post('/api/marketing/currency/' + bookingId, {});

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
      const selectedBooking = bookingOptions.find((booking) => booking.value === value);
      setSelectedValue(selectedBooking.value.toString());

      const bookingIdentifier = typeof value === 'string' ? parseInt(value) : value;
      setBooking({ ...bookings, selected: bookingIdentifier });
      await getCurrency(bookingIdentifier.toString());
    } else {
      setSelectedValue(null);
      setBooking({ ...bookings, selected: undefined });
    }
  };

  const fetchLastDates = async () => {
    try {
      const data = await fetchData({
        url: '/api/performances/lastDate/' + productionId,
        method: 'POST',
      });

      if (Array.isArray(data)) {
        const lastDates = data as Array<LastPerfDate>;
        console.log(lastDates);
        setLastDates(lastDates || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const bookingOptions = useMemo(() => {
    const initialOptions = bookings.bookings ? mapBookingsToProductionOptions(bookings.bookings) : [];

    const optWithRun = initialOptions.map((option) => {
      const lastDate = lastDates.find((x) => x.BookingId === parseInt(option.value));
      if (lastDate !== undefined) {
        const endDateDay = getWeekDayShort(lastDate.LastPerformanceDate);
        const endDateStr = formatInputDate(lastDate.LastPerformanceDate);
        if (option.date === endDateStr) {
          return option;
        } else {
          return {
            ...option,
            text: option.text.replace(DATE_PATTERN, `$1 to ${endDateDay.toUpperCase() + ' ' + endDateStr}`),
          };
        }
      } else {
        return option;
      }
    });

    optWithRun.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return optWithRun;
  }, [bookings.bookings, lastDates]);

  useEffect(() => {
    if (productionId !== null && productionId !== undefined) {
      fetchLastDates();
    }
  }, [productionId]);

  return (
    <div>
      <div className="w-full flex justify-between flex-row">
        <div className="flex flex-col mb-4">
          <div className="py-2 flex flex-row items-center gap-4">
            <h1 className="text-4xl font-bold text-primary-green">Final Sales Entry</h1>

            <div className="bg-white border-primary-border rounded-md border shadow-md">
              <div className="rounded-l-md">
                <div className="flex items-center">
                  <ProductionJumpMenu showArchivedCheck={false} />
                </div>
              </div>
            </div>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalEntryFilters;
