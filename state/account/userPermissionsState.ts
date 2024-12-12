import { atom } from 'recoil';

export interface UserPermissionsState {
  permissions: string[];
  accessibleProductions?: number[];
  accountId: string;
  isInitialised?: boolean;
}

const intialState: UserPermissionsState = {
  permissions: [],
  accessibleProductions: [],
  accountId: '',
  isInitialised: false,
};

export const userPermissionsState = atom({
  key: 'userPermissionsState',
  default: intialState,
});
