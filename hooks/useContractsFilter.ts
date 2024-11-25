import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { contractsFilterState } from 'state/contracts/contractsFilterState';
import { productionJumpState } from 'state/booking/productionJumpState';
import { contractsRowsSelector } from 'state/contracts/selectors/contractsRowsSelector';
import fuseFilter from '../utils/fuseFilter';
import { newDate } from 'services/dateService';
/*
 * Hook responsible for returning filtered and sorted Bookings
 */
const useContractsFilter = () => {
  const filter = useRecoilValue(contractsFilterState);

  const { selected, includeArchived, productions } = useRecoilValue(productionJumpState);
  const { rows } = useRecoilValue(contractsRowsSelector);

  const filteredRows = useMemo(() => {
    const archivedProductionIds = productions
      .filter((production) => production.IsArchived)
      .map((production) => production.Id);
    let filteredRowList = rows.filter(({ dateTime, productionId, contractStatus, dealMemoStatus }) => {
      if (!productionId || (!includeArchived && archivedProductionIds.includes(productionId))) {
        return false;
      }
      return (
        (selected === -1 || productionId === selected) &&
        (!filter.endDate || newDate(dateTime) <= filter.endDate) &&
        (!filter.startDate || newDate(dateTime) >= filter.startDate) &&
        (!filter.contractStatusDropDown ||
          filter.contractStatusDropDown === 'all' ||
          contractStatus === filter.contractStatusDropDown) &&
        (!filter.dealMemoStatusDropDown ||
          filter.dealMemoStatusDropDown === 'all' ||
          dealMemoStatus === filter.dealMemoStatusDropDown)
      );
    });
    if (filter.contractText)
      filteredRowList = fuseFilter(filteredRowList, filter.contractText, ['contractStatus', 'venue', 'town']);

    return filteredRowList.sort((a, b) => {
      return newDate(a.dateTime).valueOf() - newDate(b.dateTime).valueOf();
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
