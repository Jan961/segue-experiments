export type MenuOption = {
  value: string;
  label: string;
  options?: MenuOption[];
  groupHeader?: boolean;
};
