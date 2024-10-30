import { IconProps } from '../Icon/Icon';

type MenuItemIcon = {
  default: IconProps;
  active: IconProps;
};

export type MenuOption = {
  id?: string;
  value: string;
  label: string;
  options?: MenuOption[];
  groupHeader?: boolean;
  icon?: MenuItemIcon;
  expanded?: boolean;
  labelClass?: string;
  testId?: string;
  permission?: string;
};
