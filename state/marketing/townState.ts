import { atom } from 'recoil';

export interface Towns {
  towns?: Array<string>;
}

const intialState: Towns = {
  towns: [],
};

export const townState = atom({
  key: 'townState',
  default: intialState,
});

