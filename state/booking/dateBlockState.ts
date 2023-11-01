import { DateBlockDTO } from 'interfaces';
import { atom } from 'recoil';

export type DateBlockState = DateBlockDTO[];

const intialState: DateBlockState = [];

export const dateBlockState = atom({
  key: 'dateBlockState',
  default: intialState,
});
