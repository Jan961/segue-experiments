import { atom } from 'recoil';

export interface TCurrencySymbol {
  symbol?: string;
}

const intialState: TCurrencySymbol = {
  symbol: '',
};

export const currencyState = atom({
  key: 'currencyState',
  default: intialState,
});
