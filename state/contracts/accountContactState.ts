import { AccountContactDTO } from 'interfaces';
import { atom } from 'recoil';

const intialState: Array<AccountContactDTO> = [];

export const accountContactState = atom({
  key: 'accountContactState',
  default: intialState,
});
