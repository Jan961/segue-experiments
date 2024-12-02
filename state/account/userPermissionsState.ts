import { atom } from 'recoil';

export interface UserPermissionsState {
  permissions: string[];
  accountId: string;
  isInitialised?: boolean;
}

const intialState: UserPermissionsState = {
  permissions: [],
  accountId: '',
  isInitialised: false,
};

export const userPermissionsState = atom({
  key: 'userPermissionsState',
  default: intialState,
});
