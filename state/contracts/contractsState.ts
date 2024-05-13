import { ContractsDTO } from 'interfaces';
import { atom } from 'recoil';

export type ContractsState = Record<number, ContractsDTO>;

export type AddEditContractsState = {
  visible: boolean;
  startDate?: string;
  endDate?: string;
  contract?: any;
};

export const ADD_EDIT_MODAL_DEFAULT_STATE = {
  visible: false,
  startDate: null,
  endDate: null,
  contract: null,
};

export const contractsState = atom({
  key: 'contractsState',
  default: {} as ContractsState,
});

export const addEditContractsState = atom({
  key: 'addEditcontractsState',
  default: ADD_EDIT_MODAL_DEFAULT_STATE as AddEditContractsState,
});
