import { atom } from 'recoil';

export type ContractsFilterState = {
  contractText?: string;
  status?: string;
  startDate?: Date;
  endDate?: Date;
  scrollToDate?: string;
  scheduleStartDate?: Date;
  scheduleEndDate?: Date;
  dealMemoStatusDropDown?: string;
  contractStatusDropDown?: string;
};

export const intialContractsFilterState: ContractsFilterState = {
  contractText: '',
  status: 'all',
  startDate: null,
  endDate: null,
  scrollToDate: '',
  scheduleStartDate: null,
  scheduleEndDate: null,
  dealMemoStatusDropDown: 'all',
  contractStatusDropDown: 'all',
};

export const contractsFilterState = atom({
  key: 'contractsFilterState',
  default: intialContractsFilterState,
});
