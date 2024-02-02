import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { filterState } from 'state/booking/filterState';
import { productionJumpState } from 'state/booking/productionJumpState';
import { rowsSelector } from 'state/booking/selectors/rowsSelector';

const useBookingFilter = () => {
  const filter = useRecoilValue(filterState);
  const { selected } = useRecoilValue(productionJumpState);
  const rows = useRecoilValue(rowsSelector);
  const filteredRows = useMemo(() => {
    const filteredRowList = [];
    for (const row of rows) {
      const { dateTime, status, productionId, venue } = row;
      let filtered = false;
      if (selected !== -1) {
        filtered = productionId !== selected;
      }
      if (filter.endDate) {
        filtered = new Date(dateTime) >= new Date(filter.endDate);
      }
      if (filter.startDate) {
        filtered = new Date(dateTime) <= new Date(filter.startDate);
      }
      if (filter.status !== 'all') {
        filtered = status !== filter.status;
      }
      if (filter.venueText) {
        filtered = !venue?.includes?.(filter.venueText);
      }
      if (!filtered) {
        filteredRowList.push(row);
      }
    }
    return filteredRowList.sort((a, b) => {
      return new Date(a.dateTime).valueOf() - new Date(b.dateTime).valueOf();
    });
  }, [rows, selected, filter.endDate, filter.startDate, filter.status, filter.venueText]);

  return filteredRows;
};

export default useBookingFilter;
