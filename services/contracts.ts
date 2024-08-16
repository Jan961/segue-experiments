import { IContractDepartment, IContractSummary } from 'interfaces/contracts';
import prisma from 'lib/prisma';
import { isUndefined } from 'utils';

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

export const prepareContractUpdateData = (data: any) => {
  const updateData: any = {};

  // Check each field and add to updateData if defined
  if (!isUndefined(data.roleName)) {
    updateData.RoleName = data.roleName;
  }

  if (!isUndefined(data.contractStatus)) {
    updateData.ContractStatus = data.contractStatus;
  }

  if (!isUndefined(data.completedByAccUserId)) {
    updateData.CompletedByAccUserId = data.completedByAccUserId;
  }

  if (!isUndefined(data.checkedByAccUserId)) {
    updateData.CheckedByAccUserId = data.checkedByAccUserId;
  }

  if (!isUndefined(data.dateIssued)) {
    updateData.DateIssued = data.dateIssued ? new Date(data.dateIssued) : null;
  }

  if (!isUndefined(data.dateReturned)) {
    updateData.DateReturned = data.dateReturned ? new Date(data.dateReturned) : null;
  }

  if (!isUndefined(data.notes)) {
    updateData.Notes = data.notes;
  }

  if (!isUndefined(data.firstDay)) {
    updateData.FirstDay = data.firstDay ? new Date(data.firstDay) : null;
  }

  if (!isUndefined(data.lastDay)) {
    updateData.LastDay = data.lastDay ? new Date(data.lastDay) : null;
  }

  if (!isUndefined(data.availability)) {
    updateData.Availability = data.availability;
  }

  if (!isUndefined(data.rehearsalLocation)) {
    updateData.RehearsalLocation = data.rehearsalLocation;
  }

  if (!isUndefined(data.rehearsalVenueNotes)) {
    updateData.RehearsalVenueNotes = data.rehearsalVenueNotes;
  }

  if (!isUndefined(data.isAccomProvided)) {
    updateData.IsAccomProvided = data.isAccomProvided;
  }

  if (!isUndefined(data.accomNotes)) {
    updateData.AccomNotes = data.accomNotes;
  }

  if (!isUndefined(data.isTransportProvided)) {
    updateData.IsTransportProvided = data.isTransportProvided;
  }

  if (!isUndefined(data.transportNotes)) {
    updateData.TransportNotes = data.transportNotes;
  }

  if (!isUndefined(data.isNominatedDriver)) {
    updateData.IsNominatedDriver = data.isNominatedDriver;
  }

  if (!isUndefined(data.nominatedDriverNotes)) {
    updateData.NominatedDriverNotes = data.nominatedDriverNotes;
  }

  if (!isUndefined(data.paymentType)) {
    updateData.PaymentType = data.paymentType;
  }

  if (!isUndefined(data.weeklyRehFee)) {
    updateData.WeeklyRehFee = data.weeklyRehFee;
  }

  if (!isUndefined(data.weeklyRehHolPay)) {
    updateData.WeeklyRehHolPay = data.weeklyRehHolPay;
  }

  if (!isUndefined(data.weeklyPerfFee)) {
    updateData.WeeklyPerfFee = data.weeklyPerfFee;
  }

  if (!isUndefined(data.weeklyPerfHolPay)) {
    updateData.WeeklyPerfHolPay = data.weeklyPerfHolPay;
  }

  if (!isUndefined(data.weeklySubs)) {
    updateData.WeeklySubs = data.weeklySubs;
  }

  if (!isUndefined(data.weeklySubsNotes)) {
    updateData.WeeklySubsNotes = data.weeklySubsNotes;
  }

  if (!isUndefined(data.totalFee)) {
    updateData.TotalFee = data.totalFee;
  }

  if (!isUndefined(data.totalHolPay)) {
    updateData.TotalHolPay = data.totalHolPay;
  }

  if (!isUndefined(data.totalFeeNotes)) {
    updateData.TotalFeeNotes = data.totalFeeNotes;
  }

  if (!isUndefined(data.cancelFee)) {
    updateData.CancelFee = data.cancelFee;
  }

  // Handling foreign key connections
  if (!isUndefined(data.departmentId)) {
    if (data.departmentId === null) {
      updateData.ACCDepartment = { disconnect: true };
    } else {
      updateData.ACCDepartment = { connect: { ACCDeptId: data.departmentId } };
    }
  }

  if (!isUndefined(data.personId)) {
    if (data.personId === null) {
      updateData.Person = { disconnect: true };
    } else {
      updateData.Person = { connect: { PersonId: data.personId } };
    }
  }

  if (!isUndefined(data.productionId)) {
    if (data.productionId === null) {
      updateData.Production = { disconnect: true };
    } else {
      updateData.Production = { connect: { Id: data.productionId } };
    }
  }

  if (!isUndefined(data.currency)) {
    if (data.currency === null) {
      updateData.Currency = { disconnect: true };
    } else {
      updateData.Currency = { connect: { Code: data.currency } };
    }
  }

  if (!isUndefined(data.venueId)) {
    if (data.venueId === null) {
      updateData.Venue = { disconnect: true };
    } else {
      updateData.Venue = { connect: { Id: data.venueId } };
    }
  }

  if (!isUndefined(data.checkedBy)) {
    if (data.venueId === null) {
      updateData.AccountUser_ACCContract_ACCCCheckedByAccUserIdToAccountUser = { disconnect: true };
    } else {
      updateData.AccountUser_ACCContract_ACCCCheckedByAccUserIdToAccountUser = { connect: { Id: data.checkedBy } };
    }
  }

  if (!isUndefined(data.completedBy)) {
    if (data.venueId === null) {
      updateData.AccountUser_ACCContract_ACCCCompletedByAccUserIdToAccountUser = { disconnect: true };
    } else {
      updateData.AccountUser_ACCContract_ACCCCompletedByAccUserIdToAccountUser = { connect: { Id: data.completedBy } };
    }
  }

  return updateData;
};

export const fetchDepartmentList = async (): Promise<IContractDepartment[]> => {
  const departments = await prisma.ACCDepartment.findMany({});
  return departments.map(({ ACCDeptId, ACCDeptName }) => ({
    id: ACCDeptId,
    name: ACCDeptName,
  }));
};
