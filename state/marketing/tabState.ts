import { atom } from 'recoil';

export type TabState = number;

const intialState: TabState = 0;

export const tabState = atom({
  key: 'tabState',
  default: intialState,
});
