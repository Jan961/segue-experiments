import { atom } from 'recoil';

export interface Currency {
  symbol?: string;
}

const intialState: Currency = {
  symbol: '',
};

export const currencyState = atom({
  key: 'currencyState',
  default: intialState,
});
