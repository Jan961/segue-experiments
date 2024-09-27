export type PermissionGroup = {
  groupId: number;
  groupName: string;
  permissions: { id: number; name: string }[];
};

export type Production = {
  checked: boolean;
  code: string;
  id: string;
  isArchived: boolean;
  label: string;
  showCode: string;
  showName: string;
};
