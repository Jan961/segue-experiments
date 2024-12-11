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
  hasAgent: boolean;
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
  id?: number;
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

export interface IOtherWorkType {
  id: number;
  name: string;
}

export interface IPersonDetails {
  id?: number;
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
  otherWorkTypes: Partial<IOtherWorkType>[];
  notes: string;
  addressId?: string;
}

export interface IPerson {
  personDetails?: IPersonDetails;
  emergencyContact1?: EmergencyContact;
  emergencyContact2?: EmergencyContact;
  agencyDetails?: IAgencyDetails;
  salaryAccountDetails?: BankAccount;
  expenseAccountDetails?: BankAccount;
}

export interface IContractSchedule {
  production: number | null;
  department: number | null;
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

interface ITotalPayDetails {
  feeNotes: string;
  totalFee: number;
  totalHolidayPay: number;
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
  totalPayDetails: ITotalPayDetails;
  paymentBreakdownList: TPaymentBreakdown[];
  cancellationFee: number;
  cancellationFeeNotes: string;
  includeAdditionalClauses: boolean;
  additionalClause: string | null;
  customClauseList: string[];
}

export interface IScheduleDay {
  productionCode: string;
  day: string;
  date: string;
  week: number;
  venue?: string;
  isOtherDay?: boolean;
  isCancelled?: boolean;
  location?: string;
  type?: string;
  status?: string;
  capacity?: number;
  performancesPerDay?: number;
  performance1?: string;
  performance2?: string;
  mileage?: number;
  time?: string;
}
