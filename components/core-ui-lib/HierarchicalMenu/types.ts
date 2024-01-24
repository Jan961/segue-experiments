import { IconProps } from '../Icon/Icon';

type MenuItemIcon = {
  default: IconProps;
  active: IconProps;
};

export type MenuOption = {
  value: string;
  label: string;
  options?: MenuOption[];
  groupHeader?: boolean;
  icon?: MenuItemIcon;
};
