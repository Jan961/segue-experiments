import { selector } from 'recoil';
import { contractListState } from '../contractsListState';
import { contractsFilterState } from '../contractsFilterState';
import { compareStrings } from 'utils';

export const companyContractSelector = selector({
  key: 'companyContractSelector',
  get: ({ get }) => {
    const contractsLookUp = get(contractListState);
    const filters = get(contractsFilterState);
    const { status, person, startDate, endDate, department, contractText } = filters;
    console.log('====status===', status);
    return Object.values(contractsLookUp).filter((contract) => {
      return (
        (!person || person === contract.personId) &&
        (!contractText ||
          compareStrings(contract.firstName, contractText) ||
          compareStrings(contract.lastName, contractText) ||
          compareStrings(contract.role, contractText)) &&
        (department === -1 || department === contract.departmentId) &&
        (!endDate || new Date(contract.dateIssue) <= endDate) &&
        (!startDate || new Date(contract.dateIssue) >= startDate) &&
        (status === 'all' || status === contract.status)
      );
    });
  },
});
