import { BankAccount } from 'components/contracts/types';
import { IContractDepartment, IContractSummary } from 'interfaces/contracts';
import getPrismaClient from 'lib/prisma';
import { NextApiRequest } from 'next';
import { prepareQuery } from 'utils/apiUtils';

export const fetchAllStandardClauses = async (req) => {
  const prisma = await getPrismaClient(req);
  const clauses = await prisma.aCCStandardClause.findMany({});
  return clauses.map(({ Id, Text, StdClauseTitle }) => ({
    id: Id,
    text: Text,
    title: StdClauseTitle,
  }));
};

export const fetchAllContracts = async (req: NextApiRequest, productionId?: number): Promise<IContractSummary[]> => {
  const prisma = await getPrismaClient(req);
  const contracts = await prisma.aCCContract.findMany({
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
      ACCCTemplateId: true,
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
      ACCCTemplateId,
    }) => ({
      id: ContractId,
      role: RoleName,
      contractStatus: ContractStatus,
      completedBy: CompletedByAccUserId,
      checkedBy: CheckedByAccUserId,
      dateIssued: DateIssued?.toISOString?.() || null,
      dateReturned: DateReturned?.toISOString?.() || null,
      notes: Notes,
      personId: Person?.PersonId,
      firstName: Person?.PersonFirstName,
      lastName: Person?.PersonLastName,
      departmentId: ACCCDeptId,
      productionId: ProductionId,
      templateId: ACCCTemplateId,
    }),
  );
};

export const fetchDepartmentList = async (req: NextApiRequest): Promise<IContractDepartment[]> => {
  const prisma = await getPrismaClient(req);
  const departments = await prisma.aCCDepartment.findMany({});
  return departments.map(({ ACCDeptId, ACCDeptName }) => ({
    id: ACCDeptId,
    name: ACCDeptName,
  }));
};

export const prepareContractUpdateData = (data: any) => {
  const fieldMappings = [
    { key: 'roleName', updateKey: 'RoleName' },
    { key: 'contractStatus', updateKey: 'ContractStatus' },
    { key: 'completedByAccUserId', updateKey: 'CompletedByAccUserId' },
    { key: 'checkedByAccUserId', updateKey: 'CheckedByAccUserId' },
    { key: 'dateIssued', updateKey: 'DateIssued', isDate: true },
    { key: 'dateReturned', updateKey: 'DateReturned', isDate: true },
    { key: 'notes', updateKey: 'Notes' },
    { key: 'firstDay', updateKey: 'FirstDay', isDate: true },
    { key: 'lastDay', updateKey: 'LastDay', isDate: true },
    { key: 'availability', updateKey: 'Availability' },
    { key: 'rehearsalLocation', updateKey: 'RehearsalLocation' },
    { key: 'rehearsalVenueNotes', updateKey: 'RehearsalVenueNotes' },
    { key: 'isAccomProvided', updateKey: 'IsAccomProvided' },
    { key: 'accomNotes', updateKey: 'AccomNotes' },
    { key: 'isTransportProvided', updateKey: 'IsTransportProvided' },
    { key: 'transportNotes', updateKey: 'TransportNotes' },
    { key: 'isNominatedDriver', updateKey: 'IsNominatedDriver' },
    { key: 'nominatedDriverNotes', updateKey: 'NominatedDriverNotes' },
    { key: 'paymentType', updateKey: 'PaymentType' },
    { key: 'weeklyRehFee', updateKey: 'WeeklyRehFee' },
    { key: 'weeklyRehHolPay', updateKey: 'WeeklyRehHolPay' },
    { key: 'weeklyPerfFee', updateKey: 'WeeklyPerfFee' },
    { key: 'weeklyPerfHolPay', updateKey: 'WeeklyPerfHolPay' },
    { key: 'weeklySubs', updateKey: 'WeeklySubs' },
    { key: 'weeklySubsNotes', updateKey: 'WeeklySubsNotes' },
    { key: 'totalFee', updateKey: 'TotalFee' },
    { key: 'totalHolPay', updateKey: 'TotalHolPay' },
    { key: 'totalFeeNotes', updateKey: 'TotalFeeNotes' },
    { key: 'cancelFee', updateKey: 'CancelFee' },
    { key: 'checkedBy', updateKey: 'CheckedByAccUserId' },
    { key: 'completedBy', updateKey: 'CompletedByAccUserId' },
    { key: 'currency', updateKey: 'CurrencyCode' },
    { key: 'accScheduleJson', updateKey: 'ACCScheduleJSON' },
    // Foreign key connections
    { key: 'departmentId', updateKey: 'ACCDepartment', isForeignKey: true, foreignKeyId: 'ACCDeptId' },
    { key: 'personId', updateKey: 'Person', isForeignKey: true, foreignKeyId: 'PersonId' },
    { key: 'productionId', updateKey: 'Production', isForeignKey: true, foreignKeyId: 'Id' },
    { key: 'venueId', updateKey: 'Venue', isForeignKey: true, foreignKeyId: 'Id' },
  ];
  return prepareQuery(data, fieldMappings);
};

export const prepareAccountUpdateData = (accountDetails: Partial<BankAccount>, isSalary: boolean) => {
  const fieldMappings = [
    { key: 'paidTo', updateKey: isSalary ? 'PersonPaymentTo' : 'PersonExpensesTo' },
    { key: 'accountName', updateKey: isSalary ? 'PersonPaymentAccountName' : 'PersonExpensesAccountName' },
    { key: 'accountNumber', updateKey: isSalary ? 'PersonPaymentAccount' : 'PersonExpensesAccount' },
    { key: 'sortCode', updateKey: isSalary ? 'PersonPaymentSortCode' : 'PersonExpensesSortCode' },
    { key: 'swift', updateKey: isSalary ? 'PersonPaymentSWIFTBIC' : 'PersonExpensesSWIFTBIC' },
    { key: 'iban', updateKey: isSalary ? 'PersonPaymentIBAN' : 'PersonExpensesIBAN' },
    // foreign key connections
    {
      key: 'country',
      updateKey: isSalary
        ? 'Country_Person_PersonPaymentBankCountryIdToCountry'
        : 'Country_Person_PersonExpensesBankCountryIdToCountry',
      foreignKeyId: 'Id',
      isForeignKey: true,
    },
  ];

  return prepareQuery(accountDetails, fieldMappings);
};

export const prepareAgencyOrganisationUpdateData = (agencyDetails: any) => {
  const fieldMappings = [
    { key: 'name', updateKey: 'OrgName' },
    { key: 'website', updateKey: 'OrgWebsite' },
    {
      key: 'agencyPersonId',
      updateKey: 'Person_Organisation_OrgContactPersonIdToPerson',
      foreignKeyId: 'PersonId',
      isForeignKey: true,
    },
  ];

  return prepareQuery(agencyDetails, fieldMappings);
};

export const getContractDataById = async (contractId: number, req: NextApiRequest) => {
  const prisma = await getPrismaClient(req);
  return prisma.aCCContract.findUnique({
    where: { ContractId: contractId },
    include: {
      ACCClause: true,
      ACCPayment: true,
      ACCPubEvent: true,
      ACCDepartment: true,
      Person: true,
      Production: true,
      Venue: true,
    },
  });
};
