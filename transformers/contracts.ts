import { safeParseJson } from 'services/user.service';

interface PersonDetails {
  id?: number;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  landline: string | null;
  address1: string | null;
  address2: string | null;
  address3: string | null;
  town: string | null;
  mobileNumber: string | null;
  passportName: string | null;
  passportNumber: string | null;
  hasUKWorkPermit: number;
  passportExpiryDate: string | null;
  postcode: string | null;
  checkedBy: number | null;
  country: number | null;
  isFEURequired: number;
  workType: number[];
  advisoryNotes: string | null;
  generalNotes: string | null;
  healthDetails: string | null;
  otherWorkTypes: string[];
  notes: string | null;
  addressId?: number;
}

export const transformPersonDetails = (personData: any): PersonDetails => {
  if (!personData) return null;
  const otherWorkTypes =
    personData.PersonOtherRole?.map((role: any) => ({
      id: role.PORId,
      name: role.PORName,
    })) || [];
  return {
    id: personData.PersonId,
    firstName: personData.PersonFirstName || null,
    lastName: personData.PersonLastName || null,
    email: personData.PersonEmail || null,
    landline: personData.PersonPhone || null,
    addressId: personData.Address?.Id,
    address1: personData.Address?.Address1 || null,
    address2: personData.Address?.Address2 || null,
    address3: personData.Address?.Address3 || null,
    country: personData.Address?.AddressCountryId || null,
    town: personData.Address?.AddressTown || null,
    mobileNumber: personData.PersonMobile || null,
    passportName: personData.PersonPassportName || null,
    passportNumber: personData.PersonPassportName || null,
    hasUKWorkPermit: personData.PersonEligibleToWork,
    passportExpiryDate: personData.PersonPassportExpiryDate ? personData.PersonPassportExpiryDate.toISOString() : null,
    postcode: personData.Address?.AddressPostcode || null,
    checkedBy: null,
    isFEURequired: personData.PersonFEURequired,
    workType: personData.PersonPersonRole?.map((role: any) => role.PersonRole.PersonRoleId),
    advisoryNotes: personData.PersonAdvisoryNotes || null,
    generalNotes: personData.PersonNotes || null,
    healthDetails: personData.PersonHealthNotes || null,
    otherWorkTypes: Array.isArray(otherWorkTypes) && otherWorkTypes.length > 0 ? otherWorkTypes : [{ name: '' }],
    notes: personData.PersonNotes || null,
  };
};

interface OrganisationDetails {
  agencyPersonId?: number;
  id?: number;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  landline: string | null;
  address1: string | null;
  address2?: string | null;
  address3?: string | null;
  name: string | null;
  mobileNumber: string | null;
  website: string | null;
  town: string | null;
  postcode: string | null;
  country: number | null;
  agencyName: string | null;
  landlineNumber: string | null;
  agencyAddressId: number | null;
}

export const transformOrganisationDetails = (organisationData: any): OrganisationDetails | null => {
  if (!organisationData) return null;

  const contactPerson = organisationData.Person_Organisation_OrgContactPersonIdToPerson;

  return {
    agencyPersonId: contactPerson.PersonId,
    firstName: contactPerson?.PersonFirstName || null,
    lastName: contactPerson?.PersonLastName || null,
    email: contactPerson?.PersonEmail || null,
    landline: contactPerson?.PersonPhone || null,
    agencyAddressId: contactPerson?.Address?.Id || null,
    address1: contactPerson?.Address?.Address1 || null,
    address2: contactPerson?.Address?.Address2 || null,
    address3: contactPerson?.Address?.Address3 || null,
    name: organisationData.OrgName || null,
    mobileNumber: contactPerson?.PersonMobile || null,
    website: organisationData.OrgWebsite || null,
    town: contactPerson?.Address?.AddressTown || null,
    postcode: contactPerson?.Address?.AddressPostcode || null,
    country: contactPerson?.Address?.AddressCountryId || null,
    agencyName: organisationData.OrgName || null,
    id: organisationData?.OrgId || null,
    landlineNumber: contactPerson?.PersonPhone || null,
  };
};

interface AccountDetails {
  paidTo: string | null;
  accountName: string | null;
  accountNumber: string | null;
  sortCode: string | null;
  swift: string | null;
  iban: string | null;
  country: number | null;
}

export const transformAccountDetails = (accountData: any): AccountDetails => {
  if (!accountData) return null;

  return {
    paidTo: accountData.PersonPaymentTo || '',
    accountName: accountData.PersonPaymentAccountName || '',
    accountNumber: accountData.PersonPaymentAccount || '',
    sortCode: accountData.PersonPaymentSortCode || '',
    swift: accountData.PersonPaymentSWIFTBIC || '',
    iban: accountData.PersonPaymentIBAN || '',
    country: accountData.PersonPaymentBankCountryId || null,
  };
};

export const transformContractDetails = (contract: any) => {
  return {
    currency: contract.CurrencyCode,
    firstDayOfWork: contract.FirstDay?.toISOString() || null,
    lastDayOfWork: contract.LastDay?.toISOString() || null,
    specificAvailabilityNotes: contract.Availability || null,
    publicityEventList: contract.ACCPubEvent.map((event: any) => ({
      isRequired: true,
      date: event.Date?.toISOString() || null,
      notes: event.Notes || null,
    })),
    rehearsalVenue: {
      townCity: contract.RehearsalLocation || null,
      venue: contract.RehearsalVenueId || null,
      notes: contract.RehearsalVenueNotes || null,
    },
    isAccomodationProvided: contract.IsAccomProvided || false,
    accomodationNotes: contract.AccomNotes || null,
    isTransportProvided: contract.IsTransportProvided || false,
    transportNotes: contract.TransportNotes || null,
    isNominatedDriver: contract.IsNominatedDriver || false,
    nominatedDriverNotes: contract.NominatedDriverNotes || null,
    paymentType: contract.PaymentType || null,
    weeklyPayDetails: {
      rehearsalFee: contract.WeeklyRehFee ? parseInt(contract.WeeklyRehFee, 10) : null,
      rehearsalHolidayPay: contract.WeeklyRehHolPay ? parseInt(contract.WeeklyRehHolPay, 10) : null,
      performanceFee: contract.Weekly ? parseInt(contract.WeeklyPerfFee, 10) : null,
      performanceHolidayPay: contract.WeeklyPerfHolPay ? parseInt(contract.WeeklyPerfHolPay, 10) : null,
      touringAllowance: contract.WeeklySubs ? parseInt(contract.WeeklySubs, 10) : null,
      subsNotes: contract.WeeklySubsNotes || null,
    },
    totalPayDetails: {
      totalFee: contract.TotalFee ? parseInt(contract.TotalFee, 10) : null,
      totalHolidayPay: contract.TotalHolPay ? parseInt(contract.TotalHolPay, 10) : null,
      feeNotes: contract.TotalFeeNotes || null,
    },
    paymentBreakdownList: contract.ACCPayment.map((payment: any) => ({
      date: payment.Date?.toISOString() || null,
      amount: payment.Amount ? parseInt(payment.Amount, 10) : null,
      notes: payment.Notes || null,
    })),
    cancellationFee: contract.CancelFee || null,
    cancellationFeeNotes: contract.CancelFeeNotes || null,
    includeAdditionalClauses: !!contract.ACCClause.length,
    additionalClause: contract.ACCClause.map((clause: any) => clause.StdClauseId).filter((id: any) => id !== null),
    customClauseList: contract.ACCClause.map((clause: any) => clause.Text).filter((text: any) => text !== null),
    includeClauses: !!contract.ACCClause.length,
    accScheduleJson: safeParseJson(contract.ACCScheduleJSON || '') || [],
  };
};

export const transformContractResponse = (contract: any) => {
  return {
    production: contract.ProductionId,
    department: contract.ACCCDeptId,
    role: contract.RoleName,
    personId: contract.PersonId,
    templateId: 1,
    contractDetails: transformContractDetails(contract),
  };
};

export const transformContractData = (data) => {
  return {
    roleName: data.role || null,
    notes: data.specificAvailabilityNotes || null,
    currencyCode: data.currency || null,
    firstDay: data.firstDayOfWork || null,
    lastDay: data.lastDayOfWork || null,
    availability: data.specificAvailabilityNotes || null,
    rehearsalLocation: data.rehearsalVenue?.townCity || null,
    rehearsalVenueId: null,
    rehearsalVenueNotes: data.rehearsalVenue?.notes || null,
    isAccomProvided: !!data.isAccomodationProvided,
    accomNotes: data.accomodationNotes || null,
    isTransportProvided: !!data.isTransportProvided,
    transportNotes: data.transportNotes || null,
    isNominatedDriver: !!data.isNominatedDriver,
    nominatedDriverNotes: data.nominatedDriverNotes || null,
    paymentType: data.paymentType || null,
    weeklyRehFee: data.weeklyPayDetails.rehearsalFee || null,
    weeklyRehHolPay: data.weeklyPayDetails.rehearsalHolidayPay || null,
    weeklyPerfFee: data.weeklyPayDetails.performanceFee || null,
    weeklyPerfHolPay: data.weeklyPayDetails.performanceHolidayPay || null,
    weeklySubs: data.weeklyPayDetails.touringAllowance || null,
    weeklySubsNotes: data.weeklyPayDetails.subsNotes || null,
    totalFee: data.totalPayDetails.totalFee || null,
    totalHolPay: data.totalPayDetails.totalHolidayPay || null,
    totalFeeNotes: data.totalPayDetails.feeNotes || null,
    cancelFee: data.cancellationFee || null,
    productionId: data.production || null,
    departmentId: data.department || null,
    personId: data.personId || null,
    currency: data.currency || null,
    accScheduleJson: data.accScheduleJson,
  };
};
