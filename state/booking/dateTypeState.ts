import { DateTypeDTO } from 'interfaces';
import { atom } from 'recoil';

export type DateTypeState = DateTypeDTO[];

const intialState: DateTypeState = [];

export const dateTypeState = atom({
  key: 'dateTypeState',
  default: intialState,
});
