import { PersonMinimalDTO } from 'interfaces';
import { atom } from 'recoil';

export type TPersonState = Record<number, PersonMinimalDTO>;

const intialState: TPersonState = {};

export const personState = atom({
  key: 'personState',
  default: intialState,
});
