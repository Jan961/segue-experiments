import { ContractsDTO } from 'interfaces';
import { atom } from 'recoil';

export type ContractsState = Record<number, ContractsDTO>;

export type AddEditContractsState = {
  visible: boolean;
  startDate?: string;
  endDate?: string;
  booking?: any;
};

export const ADD_EDIT_MODAL_DEFAULT_STATE = {
  visible: false,
  startDate: null,
  endDate: null,
  booking: null,
};

export const contractsState = atom({
  key: 'contractsState',
  default: {} as ContractsState,
});

export const addEditcontractsState = atom({
  key: 'addEditcontractsState',
  default: ADD_EDIT_MODAL_DEFAULT_STATE as AddEditContractsState,
});
