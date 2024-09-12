import { UserPermission } from 'interfaces';
import { atom } from 'recoil';

const intialState: UserPermission[] = [];

export const userPermissionsState = atom({
  key: 'userPermissions',
  default: intialState,
});
