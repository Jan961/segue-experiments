import { StandardClauseDTO } from 'interfaces';
import { atom } from 'recoil';

export type TStandardClauseState = Record<number, StandardClauseDTO>;

const intialState: TStandardClauseState = {};

export const standardClauseState = atom({
  key: 'standarClauseState',
  default: intialState,
});
