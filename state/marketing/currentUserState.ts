import { atom } from 'recoil';

export interface CurrentUser {
  name?: string;
}

const intialState: CurrentUser = {
  name: '',
};

export const currentUserState = atom({
  key: 'currentUserState',
  default: intialState,
});
