import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { productionJumpState } from 'state/booking/productionJumpState';
import { currencyState } from 'state/marketing/currencyState';
import axios from 'axios';
import GlobalToolbar from 'components/toolbar';
import { Button, DateRange, TextInput } from 'components/core-ui-lib';

const GlobalActivityFilters = () => {
  const { selected: productionId } = useRecoilValue(productionJumpState);
  const [dateRange, setDateRange] = useState<{ to: Date; from: Date }>({ to: null, from: null });
  const [filterText, setFilterText] = useState('');
  const [, setCurrency] = useRecoilState(currencyState);

  const getCurrency = async (productionId) => {
    try {
      const response = await axios.post('/api/marketing/currency/' + productionId, {});

      if (response.data && typeof response.data === 'object') {
        const currencyObject = response.data as { currency: string };
        setCurrency({ symbol: currencyObject.currency });
      }
    } catch (error) {
      console.error('Error retrieving currency:', error);
    }
  };

  const onClearFilters = () => {
    setFilterText('');
    setDateRange({ to: null, from: null });
  };

  useEffect(() => {
    // hardcoding currency to the currency of bookingId 10 but this will in time change to production
    getCurrency(10);
  }, [productionId]);

  // Ensuring the currency is set on initial component mount
  useEffect(() => {
    if (!productionId) {
      getCurrency(10);
    }
  }, []);

  return (
    <div>
      <div className="w-full flex justify-between flex-row">
        <GlobalToolbar titleClassName="text-primary-green" title="Global Activities" />
      </div>

      <div className="flex flex-row">
        <div className="bg-white">
          <DateRange
            disabled={!productionId}
            className="bg-primary-white justify-between"
            label="Date"
            onChange={(dateRange) => setDateRange(dateRange)}
            value={dateRange}
          />
        </div>

        <TextInput
          id="filterText"
          disabled={!productionId}
          placeholder="Search Global activities..."
          className="w-[467px] mt-1 ml-5"
          iconName="search"
          value={filterText}
          onChange={(event) => setFilterText(event.target.value)}
        />

        <Button className="text-sm leading-8 w-[120px] mt-1 ml-5" text="Clear Filters" onClick={onClearFilters} />
      </div>
    </div>
  );
};

export default GlobalActivityFilters;
