export interface BankAccount {
  paidTo: string | null;
  accountName: string;
  accountNumber: string;
  sortCode: string;
  swift?: string;
  iban?: string;
  country: number | null;
}

export interface IAgencyDetails {
  firstName: string;
  lastName: string;
  email: string;
  landline: string;
  address1: string;
  address2: string;
  address3: string;
  name: string;
  mobileNumber: string;
  website: string;
  town: string;
  postcode: string;
  country: number | null;
}

export interface EmergencyContact {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  address3?: string;
  town: string;
  postcode: string;
  country: number | null;
  email: string;
  landline: string;
  mobileNumber: string;
}

export interface PersonDetails {
  firstName: string;
  lastName: string;
  email: string;
  landline: string;
  address1: string;
  address2: string;
  address3: string;
  town: string;
  mobileNumber: string;
  passportName: string;
  passportNumber: string;
  hasUKWorkPermit: boolean | null;
  passportExpiryDate: string | null;
  postcode: string;
  checkedBy: number | null;
  country: number | null;
  isFEURequired: boolean | null;
  workType: number[];
  advisoryNotes: string;
  generalNotes: string;
  healthDetails: string;
  otherWorkTypes: string[];
  notes: string;
}

export interface IContractSchedule {
  production: string | null;
  department: string | null;
  role: string;
  personId: number | null;
  templateId: number | null;
}

interface IRehearsalVenueDetails {
  townCity: string;
  venue: string | null;
  notes: string;
}

interface IWeeklyPayDetails {
  performanceFee?: number;
  performanceHolidayPay?: number;
  rehearsalFee?: number;
  rehearsalHolidayPay?: number;
  subsNotes?: string;
  touringAllowance?: number;
}

interface IContractDetails {
  currency: string | null;
  firstDayOfWork: string | null;
  lastDayOfWork: string | null;
  specificAvailabilityNotes: string;
  publicityEventList: IPublicityEventDetails[];
  rehearsalVenue: IRehearsalVenueDetails;
  isAccomodationProvided: boolean;
  accomodationNotes: string;
  isTransportProvided: boolean;
  transportNotes: string;
  isNominatedDriver: boolean;
  nominatedDriverNotes: string;
  paymentType: string | null;
  weeklyPayDetails: IWeeklyPayDetails;
  totalPayDetails: string | null;
  paymentBreakdownList: TPaymentBreakdown[];
  cancellationFee: number;
  cancellationFeeNotes: string;
  includeAdditionalClauses: boolean;
  additionalClause: string | null;
  customClauseList: string[];
}
