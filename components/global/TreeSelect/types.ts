export type HierarchicalItem = {
  id: string;
  value: string;
  label: string;
  options?: HierarchicalItem[];
};

export type TreeItemOption = {
  id: string;
  value: string;
  label: string;
  seqNo: number;
  checked?: boolean;
  options?: TreeItemOption[];
  groupHeader?: boolean;
  isPartiallySelected?: boolean;
  disabled?: boolean;
};

export type TreeItemSelectedOption = TreeItemOption & {
  parentId: string;
};
