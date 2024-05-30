import { useEffect, useMemo, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { productionJumpState } from 'state/booking/productionJumpState';
import Select from 'components/core-ui-lib/Select';
import { mapBookingsToProductionOptions } from 'mappers/productionCodeMapper';
import { bookingJumpState } from 'state/marketing/bookingJumpState';
import { ProductionJumpMenu } from 'components/global/nav/ProductionJumpMenu';
import useAxios from 'hooks/useAxios';
import { SelectOption } from './MarketingHome';

type TourResponse = {
  data: Array<SelectOption>;
  salesFreqency: string;
};

const SalesEntryFilters = () => {
  const { selected: productionId } = useRecoilValue(productionJumpState);
  const [bookings, setBooking] = useRecoilState(bookingJumpState);
  const [selectedValue, setSelectedValue] = useState(null);
  const [tourWeeks, setTourWeeks] = useState([]);
  const [selectedTourWeek, setSelectedTourWeek] = useState(null);
  const [tourLabel, setTourLabel] = useState('');
  const bookingOptions = useMemo(() => {
    const options = bookings.bookings ? mapBookingsToProductionOptions(bookings.bookings) : [];
    options.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return options;
  }, [bookings]);

  const { fetchData } = useAxios();

  const getTourWeeks = async (productionId) => {
    const data = await fetchData({
      url: '/api/marketing/sales/tourWeeks/' + productionId.toString(),
      method: 'POST',
    });

    if (typeof data === 'object') {
      const tourData = data as TourResponse;
      setTourWeeks(tourData.data);
      if (tourData.salesFreqency === 'W') {
        setTourLabel('Sales Week');
      } else if (tourData.salesFreqency === 'D') {
        setTourLabel('Sales Date');
      }
    }
  };

  useEffect(() => {
    if (productionId !== null && productionId !== undefined) {
      getTourWeeks(productionId);
    }
  }, [productionId]);

  useEffect(() => {
    setSelectedTourWeek(null);
    try {
      const selectedTourIndex = tourWeeks.findIndex((week) => week.selected === true);
      if (selectedTourIndex !== -1) {
        setSelectedTourWeek(tourWeeks[selectedTourIndex].value);
      }
    } catch (error) {
      console.log(error);
    }
  }, [tourWeeks]);

  const changeBooking = (value: string | number) => {
    if (value !== null) {
      const selectedBooking = bookingOptions.find((booking) => booking.value === value);
      setSelectedValue(selectedBooking.value.toString());

      const bookingIdentifier = typeof value === 'string' ? parseInt(value) : value;

      setBooking({ ...bookings, selected: bookingIdentifier });
    } else {
      setSelectedValue(null);
      setBooking({ ...bookings, selected: undefined });
    }
  };

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
              onChange={(tourWeek) => setSelectedTourWeek(tourWeek)}
              value={selectedTourWeek}
              disabled={!productionId}
              placeholder="Select Sales Week"
              className="bg-white w-[437px]"
              options={tourWeeks}
              isClearable
              isSearchable
              label={tourLabel}
            />
          </div>
        </div>

        <div className="flex flex-col" />
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
        />
      </div>
    </div>
  );
};

export default SalesEntryFilters;
