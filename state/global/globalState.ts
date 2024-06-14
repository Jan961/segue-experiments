import { MenuOption } from 'components/core-ui-lib/HierarchicalMenu/types';
import { atom } from 'recoil';
import { EmailTemplateType } from 'types';

export type GlobalStateType = {
  locale: string;
  menuPinned: boolean;
  menuItems: MenuOption[];
  emailTemplates?: EmailTemplateType[];
};

const intialState: GlobalStateType = {
  locale: 'en-GB',
  menuPinned: false,
  menuItems: [],
  emailTemplates: [],
};

export const globalState = atom({
  key: 'globalState',
  default: intialState,
});
