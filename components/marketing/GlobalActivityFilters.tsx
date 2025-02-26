import { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { productionJumpState } from 'state/booking/productionJumpState';
import { currencyState } from 'state/global/currencyState';
import axios from 'axios';
import GlobalToolbar from 'components/toolbar';
import { Button, DateRange, TextInput } from 'components/core-ui-lib';
import { filterState } from 'state/marketing/filterState';

const GlobalActivityFilters = () => {
  const { selected: productionId } = useRecoilValue(productionJumpState);
  const [filter, setFilter] = useRecoilState(filterState);
  const [, setCurrency] = useRecoilState(currencyState);

  const getCurrency = async (productionId) => {
    try {
      const response = await axios.get(`/api/marketing/currency/production/${productionId}`);

      if (response.data && typeof response.data === 'object') {
        const currencyObject = response.data as { currency: string };
        setCurrency({ symbol: currencyObject.currency });
      }
    } catch (error) {
      console.error('Error retrieving currency:', error);
    }
  };

  const onClearFilters = () => {
    setFilter({ startDate: null, endDate: null, searchText: '' });
  };

  useEffect(() => {
    if (productionId) {
      getCurrency(productionId);
    }
  }, [productionId]);

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
            onChange={(dateRange) => setFilter({ ...filter, startDate: dateRange.from, endDate: dateRange.to })}
            value={{ to: filter.endDate, from: filter.startDate }}
          />
        </div>

        <TextInput
          id="filterText"
          disabled={!productionId}
          placeholder="Search Global activities..."
          className="w-[467px] mt-1 ml-5"
          iconName="search"
          value={filter.searchText}
          onChange={(event) => setFilter({ ...filter, searchText: event.target.value })}
        />

        <Button className="text-sm leading-8 w-[120px] mt-1 ml-5" text="Clear Filters" onClick={onClearFilters} />
      </div>
    </div>
  );
};

export default GlobalActivityFilters;
