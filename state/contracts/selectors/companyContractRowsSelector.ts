import { selector } from 'recoil';
import { contractListState } from '../contractsListState';
import { contractsFilterState } from '../contractsFilterState';
import { compareStrings } from 'utils';
import { companyContractStatusOrder } from 'config/contracts';

export const companyContractSelector = selector({
  key: 'companyContractSelector',
  get: ({ get }) => {
    const contractsLookUp = get(contractListState);
    const filters = get(contractsFilterState);
    const { status, person, startDate, endDate, department, contractText } = filters;

    // Apply filters
    const filteredContracts = Object.values(contractsLookUp).filter((contract) => {
      return (
        (!person || person === contract.personId) &&
        (!contractText ||
          compareStrings(contract.firstName, contractText) ||
          compareStrings(contract.lastName, contractText) ||
          compareStrings(contract.role, contractText)) &&
        (department === -1 || department === contract.departmentId) &&
        (!endDate || new Date(contract.dateIssued) <= endDate) &&
        (!startDate || new Date(contract.dateIssued) >= startDate) &&
        (status === 'all' || status === contract.contractStatus)
      );
    });

    // Sort contracts by status order and then by lastName
    return filteredContracts.sort((a, b) => {
      const statusComparison =
        companyContractStatusOrder[a.contractStatus] - companyContractStatusOrder[b.contractStatus];
      if (statusComparison !== 0) {
        return statusComparison;
      }
      return a.lastName.localeCompare(b.lastName);
    });
  },
});
