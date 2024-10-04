import { IContractTemplate } from 'interfaces/contracts';
import { atom } from 'recoil';

export type TContractTemplateState = Record<number, IContractTemplate>;

const intialState: TContractTemplateState = {};

export const contractTemplateState = atom({
  key: 'contractTemplateState',
  default: intialState,
});
