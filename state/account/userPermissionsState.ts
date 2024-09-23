import { UserPermission } from 'interfaces';
import { atom } from 'recoil';

export interface UserPermissionsState {
  permissions: UserPermission[];
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
