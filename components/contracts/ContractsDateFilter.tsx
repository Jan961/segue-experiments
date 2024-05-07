import DateRange from 'components/core-ui-lib/DateRange/DateRange';
import { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { contractsFilterState, intialContractsFilterState } from 'state/contracts/contractsFilterState';
import { productionJumpState } from 'state/booking/productionJumpState';
import { contractsDateBlockSelector } from 'state/contracts/selectors/contractsDateBlockSelector';

export default function ContractsDateFilter() {
  const { scheduleStart, scheduleEnd } = useRecoilValue(contractsDateBlockSelector);
  const { selected: productionId } = useRecoilValue(productionJumpState);
  const [filter, setFilter] = useRecoilState(contractsFilterState);
  const { startDate, endDate, scheduleStartDate, scheduleEndDate } = filter || {};
  const onChange = (change: { from: Date; to: Date }) => {
    const { from: startDate, to: endDate } = change;
    setFilter({ ...filter, startDate, endDate });
  };

  useEffect(() => {
    if (!productionId) {
      setFilter(intialContractsFilterState);
    } else if (scheduleStart && scheduleEnd) {
      const start = new Date(scheduleStart);
      const end = new Date(scheduleEnd);
      setFilter({ ...filter, scheduleStartDate: start, scheduleEndDate: end, startDate: start, endDate: end });
    }
  }, [productionId, scheduleStart, scheduleEnd]);

  useEffect(() => {
    if (!startDate && !endDate) {
      setFilter((prevfilter) => ({ ...prevfilter, startDate: scheduleStartDate, endDate: scheduleEndDate }));
    }
  }, [startDate, endDate, scheduleStartDate, scheduleEndDate]);

  return (
    <div className="bg-white">
      <DateRange
        disabled={!productionId}
        className="bg-primary-white justify-between"
        label="Date"
        onChange={onChange}
        value={{ from: startDate, to: endDate }}
        minDate={scheduleStartDate}
        maxDate={scheduleEndDate}
      />
    </div>
  );
}
