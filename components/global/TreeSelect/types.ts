type TreeItemOptionRow = {
  id: string;
  value: string;
  label: string;
  checked: boolean;
};

export type TreeItemSelectedOption = TreeItemOptionRow & {
  parentId: string;
};

export type TreeItemOption = {
  id: string;
  name: string;
  options?: TreeItemOptionRow[];
};
