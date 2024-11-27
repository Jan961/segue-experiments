import React, { useEffect, useMemo, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { productionJumpState } from 'state/booking/productionJumpState';
import Select from 'components/core-ui-lib/Select';
import { mapBookingsToProductionOptions } from 'mappers/productionCodeMapper';
import { bookingJumpState } from 'state/marketing/bookingJumpState';
import { ProductionJumpMenu } from 'components/global/nav/ProductionJumpMenu';
import useAxios from 'hooks/useAxios';
import { SelectOption } from './MarketingHome';
import { getWeekDayShort, DATE_PATTERN } from 'services/dateService';
import formatInputDate from 'utils/dateInputFormat';
import { currencyState } from 'state/global/currencyState';
import axios from 'axios';

type TourResponse = {
  data: Array<SelectOption>;
  frequency: string;
};

type Props = {
  onDateChanged?: (salesWeek: any) => void;
};

const SalesEntryFilters: React.FC<Props> = ({ onDateChanged }) => {
  const { selected: productionId } = useRecoilValue(productionJumpState);
  const [bookings, setBooking] = useRecoilState(bookingJumpState);
  const [selectedValue, setSelectedValue] = useState(null);
  const [tourWeeks, setTourWeeks] = useState([]);
  const [selectedTourWeek, setSelectedTourWeek] = useState(null);
  const [tourLabel, setTourLabel] = useState('');
  const [lastDates, setLastDates] = useState([]);
  const [, setCurrency] = useRecoilState(currencyState);

  const { fetchData } = useAxios();

  const getTourWeeks = async (productionId) => {
    const data = await fetchData({
      url: '/api/marketing/sales/tourWeeks/' + productionId.toString(),
      method: 'POST',
    });

    if (typeof data === 'object') {
      const tourData = data as TourResponse;
      setTourWeeks(tourData.data);
      if (tourData.frequency === 'W') {
        setTourLabel('Sales Week');
      } else if (tourData.frequency === 'D') {
        setTourLabel('Sales Date');
      }
    }
  };

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
      const response = await axios.get(`/api/performances/lastDate/${productionId}`);

      if (Array.isArray(response.data)) {
        setLastDates(response.data || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const setTourWeek = (tourDate: string) => {
    onDateChanged(tourDate);
    setSelectedTourWeek(tourDate);
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
            text: option.text.replace(DATE_PATTERN, `$1 to ${endDateDay.toUpperCase()} ${endDateStr}`),
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
      getTourWeeks(productionId);
      fetchLastDates();
    }
  }, [productionId]);

  useEffect(() => {
    if (Array.isArray(tourWeeks) && tourWeeks.length > 0) {
      const selectedTourIndex = tourWeeks.findIndex((week) => week.selected === true);
      if (selectedTourIndex !== -1) {
        setSelectedTourWeek(tourWeeks[selectedTourIndex].value);
      }
    }
  }, [tourWeeks]);

  useEffect(() => {
    setSelectedValue(bookings.selected);
  }, [bookings.selected]);

  return (
    <div>
      <div className="w-full flex justify-between flex-row">
        <div className="flex flex-col mb-4">
          <div className="py-2 flex flex-row items-center gap-4">
            <h1 className="text-4xl font-bold text-primary-green">Sales Entry</h1>

            <div className="bg-white border-primary-border rounded-md border shadow-md">
              <div className="rounded-l-md">
                <div className="flex items-center">
                  <ProductionJumpMenu showArchivedCheck={false} />
                </div>
              </div>
            </div>

            <Select
              onChange={setTourWeek}
              value={selectedTourWeek}
              disabled={!productionId}
              placeholder="Select Sales Week"
              className="bg-white w-[437px]"
              options={tourWeeks}
              isClearable
              isSearchable
              label={tourLabel}
              testId="selectWeek"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-row items-center gap-4 mt-1">
        <Select
          onChange={changeBooking}
          value={selectedValue}
          disabled={selectedTourWeek == null}
          placeholder="Select a Venue/Date"
          className="bg-white w-[550px]"
          options={bookingOptions}
          isClearable
          isSearchable
          testId="selectBooking"
        />
      </div>
    </div>
  );
};

export default SalesEntryFilters;
