import DateRange from 'components/core-ui-lib/DateRange/DateRange';
import { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { contractsFilterState, intialContractsFilterState } from 'state/contracts/contractsFilterState';
import { productionJumpState } from 'state/booking/productionJumpState';
import { UTCDate } from '@date-fns/utc';

export default function ContractsDateFilter() {
  const { selected: productionId } = useRecoilValue(productionJumpState);
  const [filter, setFilter] = useRecoilState(contractsFilterState);
  const { startDate, endDate } = filter || {};
  const onChange = (change: { from: UTCDate; to: UTCDate }) => {
    const { from: startDate, to: endDate } = change;
    setFilter({ ...filter, startDate, endDate });
  };

  useEffect(() => {
    if (!productionId) {
      setFilter(intialContractsFilterState);
    }
  }, [productionId]);

  useEffect(() => {
    if (!startDate && !endDate) {
      setFilter((prevfilter) => ({ ...prevfilter }));
    }
  }, [startDate, endDate]);

  return (
    <div className="bg-white">
      <DateRange
        disabled={!productionId}
        className="bg-primary-white justify-between"
        label="Date"
        onChange={onChange}
        value={{ from: startDate, to: endDate }}
      />
    </div>
  );
}
