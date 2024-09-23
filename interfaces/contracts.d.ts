export interface IContractDepartment {
  id: number;
  name: string;
}

export interface IContractSummary {
  id: number;
  role: string;
  contractStatus: string;
  completedBy: number;
  checkedBy: number;
  dateIssued: string;
  dateReturned: string;
  notes: string;
  personId: number;
  firstName: string;
  lastName: string;
  departmentId: number;
  productionId: number;
  templateId: number;
}

export interface IContractTemplate {
  id: number;
  name: string;
  location: string;
}
