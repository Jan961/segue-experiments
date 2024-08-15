interface PersonDetails {
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
}

export const transformPersonDetails = (personData: any): PersonDetails => {
  if (!personData)
    return {
      firstName: null,
      lastName: null,
      email: null,
      landline: null,
      address1: null,
      address2: null,
      address3: null,
      town: null,
      mobileNumber: null,
      passportName: null,
      passportNumber: null,
      hasUKWorkPermit: 0,
      passportExpiryDate: null,
      postcode: null,
      checkedBy: null,
      country: null,
      isFEURequired: 0,
      workType: [],
      advisoryNotes: null,
      generalNotes: null,
      healthDetails: null,
      otherWorkTypes: [],
      notes: null,
    };

  return {
    firstName: personData.PersonFirstName || null,
    lastName: personData.PersonLastName || null,
    email: personData.PersonEmail || null,
    landline: personData.PersonPhone || null,
    address1: personData.Address?.Address1 || null,
    address2: personData.Address?.Address2 || null,
    address3: personData.Address?.Address3 || null,
    town: personData.Address?.AddressTown || null,
    mobileNumber: personData.PersonMobile || null,
    passportName: personData.PersonPassportName || null,
    passportNumber: personData.PersonPassportName || null,
    hasUKWorkPermit: personData.PersonEligibleToWork,
    passportExpiryDate: personData.PersonPassportExpiryDate ? personData.PersonPassportExpiryDate.toISOString() : null,
    postcode: personData.Address?.AddressPostcode || null,
    checkedBy: null,
    country: personData.Address?.CountryId || null,
    isFEURequired: personData.PersonFEURequired,
    workType: personData.PersonPersonRole?.map((role: any) => role.PersonRoleId),
    advisoryNotes: personData.PersonAdvisoryNotes || null,
    generalNotes: personData.PersonNotes || null,
    healthDetails: personData.PersonHealthNotes || null,
    otherWorkTypes: personData.PersonOtherRole?.map((role: any) => role.PORName),
    notes: personData.PersonNotes || null,
  };
};

interface OrganisationDetails {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  landline: string | null;
  address1: string | null;
  address2: string | null;
  name: string | null;
  mobileNumber: string | null;
  website: string | null;
  town: string | null;
  postcode: string | null;
  country: number | null;
  agencyName: string | null;
  landlineNumber: string | null;
}

export const transformOrganisationDetails = (organisationData: any): OrganisationDetails | null => {
  if (!organisationData) return null;

  const contactPerson = organisationData.Person_Organisation_OrgContactPersonIdToPerson;

  return {
    firstName: contactPerson?.PersonFirstName || null,
    lastName: contactPerson?.PersonLastName || null,
    email: contactPerson?.PersonEmail || null,
    landline: contactPerson?.PersonPhone || null,
    address1: contactPerson?.Address?.Address1 || null,
    address2: contactPerson?.Address?.Address2 || null,
    name: organisationData.OrgName || null,
    mobileNumber: contactPerson?.PersonMobile || null,
    website: organisationData.OrgWebsite || null,
    town: contactPerson?.Address?.AddressTown || null,
    postcode: contactPerson?.Address?.AddressPostcode || null,
    country: contactPerson?.Address?.CountryId || null,
    agencyName: organisationData.OrgName || null,
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
  if (!accountData)
    return {
      paidTo: '',
      accountName: '',
      accountNumber: '',
      sortCode: '',
      swift: '',
      iban: '',
      country: null,
    };

  return {
    paidTo: accountData.PersonPaymentTo || '',
    accountName: '',
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
      isRequired: true, // Assuming all events are required; adjust as needed
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
      rehearsalFee: contract.WeeklyRehFee || null,
      rehearsalHolidayPay: contract.WeeklyRehHolPay || null,
      performanceFee: contract.WeeklyPerfFee || null,
      performanceHolidayPay: contract.WeeklyPerfHolPay || null,
      touringAllowance: contract.WeeklySubs || null,
      subsNotes: contract.WeeklySubsNotes || null,
    },
    totalPayDetails: {
      totalFee: contract.TotalFee || null,
      totalHolidayPay: contract.TotalHolPay || null,
      feeNotes: contract.TotalFeeNotes || null,
    },
    paymentBreakdownList: contract.ACCPayment.map((payment: any) => ({
      date: payment.Date?.toISOString() || null,
      amount: payment.Amount || null,
      notes: payment.Notes || null,
    })),
    cancellationFee: contract.CancelFee || null,
    cancellationFeeNotes: contract.CancelFeeNotes || null,
    includeAdditionalClauses: !!contract.ACCClause.length, // Assuming any clause means additional clauses were included
    additionalClause: contract.ACCClause.map((clause: any) => clause.StdClauseId).filter((id: any) => id !== null),
    customClauseList: contract.ACCClause.map((clause: any) => clause.Text).filter((text: any) => text !== null),
    includeClauses: !!contract.ACCClause.length,
  };
};

export const transformContractResponse = (contract: any) => {
  return {
    production: contract.ProductionId,
    department: contract.ACCCDeptId,
    role: contract.RoleName,
    personId: contract.PersonId,
    templateId: null, // Assuming templateId is not stored directly in the contract, set as null or retrieve if applicable
    contractDetails: transformContractDetails(contract),
  };
};
