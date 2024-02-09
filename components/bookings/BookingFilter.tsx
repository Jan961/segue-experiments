import DateRange from 'components/core-ui-lib/DateRange/DateRange';
import { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { filterState } from 'state/booking/filterState';
import { productionJumpState } from 'state/booking/productionJumpState';
import { dateBlockSelector } from 'state/booking/selectors/dateBlockSelector';

export default function BookingsButtons() {
  const { scheduleStart, scheduleEnd } = useRecoilValue(dateBlockSelector);
  const { selected: ProductionId } = useRecoilValue(productionJumpState);
  const [filter, setFilter] = useRecoilState(filterState);
  const { startDate, endDate, scheduleStartDate, scheduleEndDate } = filter || {};
  const onChange = (change: { from: Date; to: Date }) => {
    const { from: startDate, to: endDate } = change;
    setFilter({ ...filter, startDate, endDate });
  };

  useEffect(() => {
    if (scheduleStart && scheduleEnd) {
      const start = new Date(scheduleStart);
      const end = new Date(scheduleEnd);
      setFilter({ ...filter, scheduleStartDate: start, scheduleEndDate: end, startDate: start, endDate: end });
    }
  }, [ProductionId, scheduleStart, scheduleEnd]);

  return (
    <div className="bg-white">
      <DateRange
        disabled={!ProductionId}
        className="bg-primary-white"
        label="Date"
        onChange={onChange}
        value={{ from: startDate, to: endDate }}
        minDate={scheduleStartDate}
        maxDate={scheduleEndDate}
      />
    </div>
  );
}
