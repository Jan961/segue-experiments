import { atom } from 'recoil';

export interface UserPermissionsState {
  permissions: string[];
  accountId: string;
}

const intialState: UserPermissionsState = {
  permissions: [],
  accountId: '',
};

export const userPermissionsState = atom({
  key: 'userPermissionsState',
  default: intialState,
});
