export type TreeItemOption = {
  id: string;
  value: string;
  label: string;
  checked: boolean;
  options?: TreeItemOption[];
  groupHeader?: boolean;
  isPartiallySelected?: boolean;
};

export type TreeItemSelectedOption = TreeItemOption & {
  parentId: string;
};
