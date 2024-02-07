import { useEffect, useMemo } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { filterState } from 'state/booking/filterState';
import { productionJumpState } from 'state/booking/productionJumpState';
import { rowsSelector } from 'state/booking/selectors/rowsSelector';

const useBookingFilter = () => {
  const [filter, setFilter] = useRecoilState(filterState);
  const { selected } = useRecoilValue(productionJumpState);
  const { rows, scheduleStart, scheduleEnd } = useRecoilValue(rowsSelector);

  const filteredRows = useMemo(() => {
    const filteredRowList = rows.filter(({ dateTime, status, productionId, venue, town }) => {
      return (
        (selected === -1 || productionId === selected) &&
        (!filter.endDate || new Date(dateTime) <= filter.endDate) &&
        (!filter.startDate || new Date(dateTime) >= filter.startDate) &&
        (filter.status === 'all' || status === filter.status) &&
        (!filter.venueText ||
          venue?.toLowerCase?.().includes?.(filter.venueText?.toLowerCase()) ||
          town?.toLowerCase?.().includes?.(filter.venueText?.toLowerCase()))
      );
    });
    return filteredRowList.sort((a, b) => {
      return new Date(a.dateTime).valueOf() - new Date(b.dateTime).valueOf();
    });
  }, [rows, selected, filter.endDate, filter.startDate, filter.status, filter.venueText]);

  useEffect(() => {
    if (scheduleStart && scheduleEnd) {
      const start = new Date(scheduleStart);
      const end = new Date(scheduleEnd);
      setFilter({ ...filter, productionStartDate: start, productionEndDate: end, startDate: start, endDate: end });
    }
  }, [selected, scheduleStart, scheduleEnd]);

  return filteredRows;
};

export default useBookingFilter;
