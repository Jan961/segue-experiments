import { Country } from '@prisma/client';
import { atom } from 'recoil';

export type CountryState = Array<Country>;

const intialState: CountryState = [];

export const countryState = atom({
  key: 'countryState',
  default: intialState,
});
