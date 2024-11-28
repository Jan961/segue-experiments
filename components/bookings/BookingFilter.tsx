import { UTCDate } from '@date-fns/utc';
import DateRange from 'components/core-ui-lib/DateRange/DateRange';
import { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { newDate } from 'services/dateService';
import { filterState, intialBookingFilterState } from 'state/booking/filterState';
import { productionJumpState } from 'state/booking/productionJumpState';
import { dateBlockSelector } from 'state/booking/selectors/dateBlockSelector';

export default function BookingsButtons() {
  const { scheduleStart, scheduleEnd } = useRecoilValue(dateBlockSelector);
  const { selected: ProductionId } = useRecoilValue(productionJumpState);
  const [filter, setFilter] = useRecoilState(filterState);
  const { startDate, endDate, scheduleStartDate, scheduleEndDate } = filter || {};
  const onChange = (change: { from: UTCDate; to: UTCDate }) => {
    const { from: startDate, to: endDate } = change;
    setFilter({ ...filter, startDate, endDate });
  };

  useEffect(() => {
    if (!ProductionId) {
      setFilter(intialBookingFilterState);
    } else if (scheduleStart && scheduleEnd) {
      const start = newDate(scheduleStart);
      const end = newDate(scheduleEnd);
      setFilter({ ...filter, scheduleStartDate: start, scheduleEndDate: end, startDate: start, endDate: end });
    }
  }, [ProductionId, scheduleStart, scheduleEnd]);

  useEffect(() => {
    if (!startDate && !endDate) {
      setFilter((prevfilter) => ({ ...prevfilter, startDate: scheduleStartDate, endDate: scheduleEndDate }));
    }
  }, [startDate, endDate, scheduleStartDate, scheduleEndDate]);

  return (
    <div className="bg-white">
      <DateRange
        testId="booking-filters-production-date-range"
        disabled={!ProductionId}
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
