import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { filterState } from 'state/booking/filterState';
import { productionJumpState } from 'state/booking/productionJumpState';
import { rowsSelector } from 'state/booking/selectors/rowsSelector';
/*
 * Hook responsible for returning filtered and sorted Bookings
 */
const useBookingFilter = () => {
  const filter = useRecoilValue(filterState);
  const { selected, includeArchived, productions } = useRecoilValue(productionJumpState);
  const { rows } = useRecoilValue(rowsSelector);

  const tz = useMemo(() => filter?.endDate?.getTimezoneOffset() * 60000 || 0, [filter]);

  const compareUTCAndLocalDates = (utcDate: Date, localDate: Date, tzOffset: number, comparator: string) => {
    if (comparator === 'lte') {
      return utcDate.getTime() + tzOffset <= localDate.getTime();
    } else if (comparator === 'gte') {
      return utcDate.getTime() - tzOffset >= localDate.getTime();
    }
  };

  const filteredRows = useMemo(() => {
    const archivedProductionIds = productions
      .filter((production) => production.IsArchived)
      .map((production) => production.Id);
    const filteredRowList = rows.filter(({ dateTime, status, productionId, venue, town }) => {
      if (!productionId || (!includeArchived && archivedProductionIds.includes(productionId))) {
        return false;
      }
      return (
        (selected === -1 || productionId === selected) &&
        (!filter.endDate || compareUTCAndLocalDates(new Date(dateTime), filter.endDate, tz, 'lte')) &&
        (!filter.startDate || compareUTCAndLocalDates(new Date(dateTime), filter.startDate, tz, 'gte')) &&
        (filter.status === 'all' || status === filter.status) &&
        (!filter.venueText ||
          venue?.toLowerCase?.().includes?.(filter.venueText?.toLowerCase()) ||
          town?.toLowerCase?.().includes?.(filter.venueText?.toLowerCase()))
      );
    });
    return filteredRowList.sort((a, b) => {
      return new Date(a.dateTime).valueOf() - new Date(b.dateTime).valueOf();
    });
  }, [productions, rows, filter.endDate, filter.startDate, filter.status, filter.venueText, includeArchived, selected]);

  return filteredRows;
};

export default useBookingFilter;
