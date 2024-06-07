import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { contractsFilterState } from 'state/contracts/contractsFilterState';
import { productionJumpState } from 'state/booking/productionJumpState';
import { contractsRowsSelector } from 'state/contracts/selectors/contractsRowsSelector';
import { contractsStatusMap } from 'config/contracts';
import Fuse from 'fuse.js';
/*
 * Hook responsible for returning filtered and sorted Bookings
 */
const useContractsFilter = () => {
  const filter = useRecoilValue(contractsFilterState);

  const { selected, includeArchived, productions } = useRecoilValue(productionJumpState);
  const { rows } = useRecoilValue(contractsRowsSelector);
  const fuseOptions = {
    includeScore: true,
    includeMatches: true,
    isCaseSensitive: false,
    shouldSort: true,
    useExtendedSearch: true,
    threshold: 0.3,
    keys: [],
  };

  const filteredRows = useMemo(() => {
    const archivedProductionIds = productions
      .filter((production) => production.IsArchived)
      .map((production) => production.Id);
    let filteredRowList = rows.filter(({ dateTime, productionId, contractStatus }) => {
      if (!productionId || (!includeArchived && archivedProductionIds.includes(productionId))) {
        return false;
      }
      return (
        (selected === -1 || productionId === selected) &&
        (!filter.endDate || new Date(dateTime) <= filter.endDate) &&
        (!filter.startDate || new Date(dateTime) >= filter.startDate) &&
        (filter.contractStatusDropDown === 'all' ||
          contractStatus === contractsStatusMap[filter.contractStatusDropDown]) &&
        (filter.dealMemoStatusDropDown === 'all' ||
          contractStatus === contractsStatusMap[filter.dealMemoStatusDropDown]) &&
        !filter.contractText
      );
    });
    if (filter.contractText) {
      fuseOptions.keys = ['contractStatus', 'venue', 'town'];
      const fuse = new Fuse(filteredRowList, fuseOptions);
      filteredRowList = fuse.search(filter.contractText).map((item) => item.item);
    }

    return filteredRowList.sort((a, b) => {
      return new Date(a.dateTime).valueOf() - new Date(b.dateTime).valueOf();
    });
  }, [
    productions,
    rows,
    filter.endDate,
    filter.startDate,
    filter.contractText,
    filter.contractStatusDropDown,
    filter.dealMemoStatusDropDown,
    includeArchived,
    selected,
  ]);
  return filteredRows;
};

export default useContractsFilter;
