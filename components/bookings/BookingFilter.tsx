import DateRange from 'components/core-ui-lib/DateRange/DateRange';
import { useRecoilState, useRecoilValue } from 'recoil';
import { filterState } from 'state/booking/filterState';
import { productionJumpState } from 'state/booking/productionJumpState';

export default function BookingsButtons() {
  const { selected: ProductionId } = useRecoilValue(productionJumpState);
  const [filter, setFilter] = useRecoilState(filterState);
  const { startDate, endDate, productionStartDate, productionEndDate } = filter || {};
  const onChange = (change: { from: Date; to: Date }) => {
    const { from: startDate, to: endDate } = change;
    setFilter({ ...filter, startDate, endDate });
  };
  return (
    <div className="bg-white">
      <DateRange
        disabled={!ProductionId}
        className="bg-primary-white"
        label="Date"
        onChange={onChange}
        value={{ from: startDate, to: endDate }}
        minDate={productionStartDate}
        maxDate={productionEndDate}
      />
    </div>
  );
}
