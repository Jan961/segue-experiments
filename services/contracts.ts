import { IContractDepartment, IContractSummary } from 'interfaces/contracts';
import prisma from 'lib/prisma';

export const fetchAllStandardClauses = async () => {
  const clauses = await prisma.ACCStandardClause.findMany({});
  return clauses.map(({ Id, Text, StdClauseTitle }) => ({
    id: Id,
    text: Text,
    title: StdClauseTitle,
  }));
};

export const fetchAllContracts = async (productionId?: number): Promise<IContractSummary[]> => {
  const contracts = await prisma.ACCContract.findMany({
    where: {
      ...(productionId && {
        ProductionId: productionId,
      }),
    },
    select: {
      ContractId: true,
      RoleName: true,
      ContractStatus: true,
      CompletedByAccUserId: true,
      CheckedByAccUserId: true,
      DateIssued: true,
      DateReturned: true,
      Notes: true,
      ACCCDeptId: true,
      ProductionId: true,
      Person: {
        select: {
          PersonId: true,
          PersonFirstName: true,
          PersonLastName: true,
        },
      },
    },
  });
  return contracts.map(
    ({
      ContractId,
      RoleName,
      ContractStatus,
      CompletedByAccUserId,
      CheckedByAccUserId,
      DateIssued,
      DateReturned,
      Notes,
      Person,
      ACCCDeptId,
      ProductionId,
    }) => ({
      id: ContractId,
      role: RoleName,
      status: ContractStatus,
      completedBy: CompletedByAccUserId,
      checkedBy: CheckedByAccUserId,
      dateIssue: DateIssued?.toISOString?.() || null,
      dateReturned: DateReturned?.toISOString?.() || null,
      notes: Notes,
      personId: Person?.PersonId,
      firstName: Person?.PersonFirstName,
      lastName: Person?.PersonLastName,
      departmentId: ACCCDeptId,
      productionId: ProductionId,
    }),
  );
};

export const fetchDepartmentList = async (): Promise<IContractDepartment[]> => {
  const departments = await prisma.ACCDepartment.findMany({});
  return departments.map(({ ACCDeptId, ACCDeptName }) => ({
    id: ACCDeptId,
    name: ACCDeptName,
  }));
};
