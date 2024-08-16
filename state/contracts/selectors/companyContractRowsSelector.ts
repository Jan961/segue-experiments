import { selector } from 'recoil';
import { contractListState } from '../contractsListState';
import { contractsFilterState } from '../contractsFilterState';

export const companyContractSelector = selector({
  key: 'companyContractSelector',
  get: ({ get }) => {
    const contractsLookUp = get(contractListState);
    const filters = get(contractsFilterState);
    const { status, person, startDate, endDate, department } = filters;
    return Object.values(contractsLookUp).filter((contract) => {
      return (
        (!person || person === contract.personId) &&
        (department === -1 || department === contract.departmentId) &&
        (!endDate || new Date(contract.dateIssue) <= endDate) &&
        (!startDate || new Date(contract.dateIssue) >= startDate) &&
        (status === 'all' || status === contract.status)
      );
    });
  },
});
