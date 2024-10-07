import { TContractDepartmentState } from 'state/contracts/contractDepartmentState';

export const getDepartmentNameByID = (id, departmentMap: TContractDepartmentState) => {
  const item = Object.values(departmentMap).find((item) => item.id === id);
  return item ? item.name : null;
};
