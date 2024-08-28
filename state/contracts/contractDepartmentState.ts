import { IContractDepartment } from 'interfaces/contracts';
import { atom } from 'recoil';

export type TContractDepartmentState = Record<number, IContractDepartment>;

const intialState: TContractDepartmentState = {};

export const contractDepartmentState = atom({
  key: 'contractDepartmentState',
  default: intialState,
});
