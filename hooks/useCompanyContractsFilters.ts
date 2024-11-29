import { UTCDate } from '@date-fns/utc';
import { companyContractStatusOrder } from 'config/contracts';
import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { compareDatesWithoutTime } from 'services/dateService';
import { contractsFilterState } from 'state/contracts/contractsFilterState';
import { contractListState } from 'state/contracts/contractsListState';
import { compareStrings } from 'utils';
import fuseFilter from 'utils/fuseFilter';

/*
 * Hook responsible for returning filtered and sorted company contracts
 */
const useCompanyContractsFilter = () => {
  const contractsLookUp = useRecoilValue(contractListState);
  const filters = useRecoilValue(contractsFilterState);
  const { status, person, startDate, endDate, department, contractText } = filters;
  const filteredRows = useMemo(() => {
    let filteredRowList = Object.values(contractsLookUp).filter((contract) => {
      return (
        (!person || person === contract.personId) &&
        (!contractText ||
          compareStrings(contract.firstName, contractText) ||
          compareStrings(contract.lastName, contractText) ||
          compareStrings(contract.role, contractText)) &&
        (department === -1 || !department || department === contract.departmentId) &&
        (!endDate || compareDatesWithoutTime(contract.dateIssued, new UTCDate(endDate), '<=')) &&
        (!startDate || compareDatesWithoutTime(contract.dateIssued, new UTCDate(startDate), '>=')) &&
        (status === 'all' || status === contract.contractStatus)
      );
    });

    if (contractText) filteredRowList = fuseFilter(filteredRowList, contractText, ['firstName', 'lastName', 'role']);

    return filteredRowList
      .map((contract) => ({ ...contract }))
      .sort((a, b) => {
        const statusComparison =
          companyContractStatusOrder[a.contractStatus] - companyContractStatusOrder[b.contractStatus];
        if (statusComparison !== 0) {
          return statusComparison;
        }
        return a.lastName.localeCompare(b.lastName);
      });
  }, [status, person, startDate, endDate, department, contractText, contractsLookUp]);

  return filteredRows;
};

export default useCompanyContractsFilter;
