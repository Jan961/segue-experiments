import { UICurrency } from 'interfaces';
import { atom } from 'recoil';

export type CurrencyList = Partial<UICurrency>[];

const intialState: CurrencyList = [];

export const currencyListState = atom({
  key: 'currencyListState',
  default: intialState,
});
