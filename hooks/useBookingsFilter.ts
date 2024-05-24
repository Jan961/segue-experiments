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

  const filterVenueInput = (inputFields, searchTerm) => {
    //    Regex to remove punctuation and then splits by spaces
    const formatStrings = (inputText) => {
      return inputText
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .split(' ')
        .filter((str) => str !== '');
    };
    //    Joins the fields. In this case, joining the Venue name and the Town
    const venueNameSplit = formatStrings(inputFields.join(' '));
    const filterNameSplit = formatStrings(searchTerm);

    //    For each of the String arrays compare if they have matches
    return filterNameSplit.every((filterElement) => {
      return venueNameSplit.some((venueElement) => venueElement.includes(filterElement));
    });
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
        (!filter.endDate || new Date(dateTime) <= filter.endDate) &&
        (!filter.startDate || new Date(dateTime) >= filter.startDate) &&
        (filter.status === 'all' || status === filter.status) &&
        (!filter.venueText || filterVenueInput([venue, town], filter.venueText))
      );
    });
    return filteredRowList.sort((a, b) => {
      return new Date(a.dateTime).valueOf() - new Date(b.dateTime).valueOf();
    });
  }, [productions, rows, filter.endDate, filter.startDate, filter.status, filter.venueText, includeArchived, selected]);

  return filteredRows;
};

export default useBookingFilter;
