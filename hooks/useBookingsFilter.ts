import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { filterState } from 'state/booking/filterState';
import { productionJumpState } from 'state/booking/productionJumpState';
import { rowsSelector } from 'state/booking/selectors/rowsSelector';
import Fuse from 'fuse.js';
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
        (!filter.endDate || new Date(dateTime) <= filter.endDate) &&
        (!filter.startDate || new Date(dateTime) >= filter.startDate) &&
        (filter.status === 'all' || status === filter.status)
      );
    });
    const fuseOptions = {
      includeScore: true,
      includeMatches: true,
      isCaseSensitive: false,
      shouldSort: true,
      useExtendedSearch: true,
      threshold: 0.3,
      keys: ['town', 'venue'],
    };
    if (filter.venueText !== '') {
      const fuse = new Fuse(filteredRowList, fuseOptions);
      filteredRowList = fuse.search(filter.venueText).map((item) => item.item);
    }
    return filteredRowList.sort((a, b) => {
      return new Date(a.dateTime).valueOf() - new Date(b.dateTime).valueOf();
    });
  }, [productions, rows, filter.endDate, filter.startDate, filter.status, filter.venueText, includeArchived, selected]);

  return filteredRows;
};

export default useBookingFilter;
