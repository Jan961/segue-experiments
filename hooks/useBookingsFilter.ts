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
      return (
        (selected === -1 || productionId === selected) &&
        (!filter.endDate || compareDatesWithoutTime(dateTime, filter.endDate, '<=')) &&
        (!filter.startDate || compareDatesWithoutTime(dateTime, filter.startDate, '>=')) &&
        (filter.status === 'all' || status === filter.status || (filter.status === 'A' && status === ''))
      );
    });

    if (filter.venueText) filteredRowList = fuseFilter(filteredRowList, filter.venueText, ['town', 'venue']);

    return filteredRowList.sort((a, b) => {
      return new Date(a.dateTime).valueOf() - new Date(b.dateTime).valueOf();
    });
  }, [productions, rows, filter.endDate, filter.startDate, filter.status, filter.venueText, includeArchived, selected]);

  return filteredRows;
};

export default useBookingFilter;
