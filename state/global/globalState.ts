import { MenuOption } from 'components/core-ui-lib/HierarchicalMenu/types';
import { atom } from 'recoil';

export type GlobalStateType = {
  locale: string;
  menuPinned: boolean;
  menuItems: MenuOption[];
};

const intialState: GlobalStateType = {
  locale: 'en-GB',
  menuPinned: false,
  menuItems: [],
};

export const globalState = atom({
  key: 'globalState',
  default: intialState,
});
