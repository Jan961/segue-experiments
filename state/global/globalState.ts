import { atom } from 'recoil';

export type GlobalStateType = {
    locale: string;
};

const intialState: GlobalStateType = {
  locale:'en-GB',
};

export const globalState = atom({
  key: 'globalState',
  default: intialState,
});