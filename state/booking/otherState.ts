import { OtherDTO } from 'interfaces';
import { atom } from 'recoil';

export type OtherState = Record<number, OtherDTO>;

const intialState: OtherState = {};

export const otherState = atom({
  key: 'otherState',
  default: intialState,
});
