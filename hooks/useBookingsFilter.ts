import { UTCDate } from '@date-fns/utc';
import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { compareDatesWithoutTime } from 'services/dateService';
import { filterState } from 'state/booking/filterState';
import { productionJumpState } from 'state/booking/productionJumpState';
import { rowsSelector } from 'state/booking/selectors/rowsSelector';
import fuseFilter from 'utils/fuseFilter';
/*
 * Hook responsible for returning filtered and sorted Bookings
 */
const useBookingFilter = () => {
  const filter = useRecoilValue(filterState);
  const { selected, includeArchived, productions } = useRecoilValue(productionJumpState);
  const { rows } = useRecoilValue(rowsSelector);

  const filteredRows = useMemo(() => {
    const archivedProductionIds = productions
      .filter((production) => production.IsArchived)
      .map((production) => production.Id);
    let filteredRowList = rows.filter(({ dateTime, status, productionId }) => {
      if (!productionId || (!includeArchived && archivedProductionIds.includes(productionId))) {
        return false;
      }
      console.log('Filter DateTime', filter.startDate, filter.endDate);
      console.log(
        'Filter logic',
        !filter.startDate || new Date(dateTime) >= filter.startDate,
        !filter.endDate || new Date(dateTime) <= filter.endDate,
      );
      return (
        (selected === -1 || productionId === selected) &&
        (!filter.endDate || compareDatesWithoutTime(dateTime, new UTCDate(filter.endDate), '<=')) &&
        (!filter.startDate || compareDatesWithoutTime(dateTime, new UTCDate(filter.startDate), '>=')) &&
        (filter.status === 'all' || status === filter.status || (filter.status === 'A' && status === ''))
      );
    });
    console.log(filteredRowList);

    if (filter.venueText) filteredRowList = fuseFilter(filteredRowList, filter.venueText, ['town', 'venue']);

    return filteredRowList.sort((a, b) => {
      return new Date(a.dateTime).valueOf() - new Date(b.dateTime).valueOf();
    });
  }, [productions, rows, filter.endDate, filter.startDate, filter.status, filter.venueText, includeArchived, selected]);

  return filteredRows;
};

export default useBookingFilter;
