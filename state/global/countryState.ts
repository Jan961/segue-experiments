import { Country } from 'prisma/generated/prisma-client';
import { atom } from 'recoil';

export type TCountryState = Array<Country>;

const intialState: TCountryState = [];

export const countryState = atom({
  key: 'countryState',
  default: intialState,
});
