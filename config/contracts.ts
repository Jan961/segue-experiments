import { SelectOption } from 'components/core-ui-lib/Select/Select';

export const statusOptions: SelectOption[] = [
  { text: 'Received Not Returned', value: 'CSAR' },
  { text: 'Received, Questions Raised', value: 'U' },
  { text: 'Producer Signed, Returned to Venue', value: 'X' },
  { text: 'Countersigned and Filed', value: 'CSAF' },
  { text: 'None', value: 'NONE' },
];

export const dealTypeOptions: SelectOption[] = [
  { text: 'None', value: 'NULL' },
  { text: 'Split', value: 'SPLT' },
  { text: 'Guarantee', value: 'GUA' },
  { text: 'Call Single', value: 'CS' },
  { text: 'Call Multiple', value: 'CM' },
  { text: 'First Call Against Split', value: 'FCAS' },
];

export const allStatusOptions: SelectOption[] = [{ text: 'All', value: 'all' }, ...statusOptions];

export const booleanOptions = [
  { text: 'YES', value: true },
  { text: 'NO', value: false },
];

export const callOptions = [
  { text: 'PROMOTER', value: 'p' },
  { text: 'VENUE', value: 'v' },
];

export const callValueOptions = [
  { text: 'PERCENTAGE', value: 'p' },
  { text: 'VALUE', value: 'v' },
];

export const calls = ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'Ninth', 'Tenth'];

export const saleFrequency = [
  { text: 'Weekly', value: 'W' },
  { text: 'Daily', value: 'D' },
];

export const saleFrequencyDay = [
  { text: 'Sunday', value: 0 },
  { text: 'Monday', value: 1 },
  { text: 'Tuesday', value: 2 },
  { text: 'Wednesday', value: 3 },
  { text: 'Thursday', value: 4 },
  { text: 'Friday', value: 5 },
  { text: 'Saturday', value: 6 },
];

export const transactionOptions = [
  { text: 'Per Ticket', value: 'Per Ticket' },
  { text: 'Per Transaction', value: 'Per Transaction' },
];

export const sellerOptions = [
  { text: 'PRODUCTION', value: 'Production' },
  { text: 'VENUE', value: 'Venue' },
];

export const contractsStatusMap = {
  CSAR: 'Received Not Returned',
  U: 'Received, Questions Raised',
  X: 'Producer Signed, Returned to Venue',
  CSAF: 'Countersigned and Filed',
  NONE: 'None',
};

export const contractsKeyStatusMap = {
  'Received Not Returned': 'CSAR',
  'Received, Questions Raised': 'U',
  'Producer Signed, Returned to Venue': 'X',
  'Countersigned and Filed': 'CSAF',
  None: 'NONE',
};

export const contractDealTypeMap = {
  NULL: 'None',
  SPLT: 'Split',
  GUA: 'Guarantee',
  CS: 'Call Single',
  CM: 'Call Multiple',
  FCAS: 'First Call Against Split',
};

export const contractsRow = {
  Id: null,
  date: '',
  dateTime: '',
  week: '',
  venue: '',
  town: '',
  performanceCount: '',
  performanceTimes: '',
  productionName: '',
  productionId: null,
  production: null,
  bookingStatus: '',
  status: '',
  dayType: '',
  capacity: null,
  note: '',
  contractStatus: '',
};

export const defaultVenueFilters = {
  venueId: null,
  town: '',
  country: null,
  productionId: null,
  search: '',
};

export const initialEditContractFormData = {
  StatusCode: '',
  SignedDate: null,
  ReturnDate: null,
  ReceivedBackDate: null,
  DealType: '',
  bookingNotes: '',
  TicketPriceNotes: '',
  MarketingDealNotes: '',
  CrewNotes: '',
  Exceptions: '',
  Notes: '',
  MerchandiseNotes: '',
};

export const initialEditDemoFormData = {
  Id: null,
  BookingId: null,
  AgreementDate: null,
  AccContId: null,
  RunningTime: null,
  RunningTimeNotes: '',
  PrePostShowEvents: '',
  VenueCurfewTime: null,
  PerformanceNotes: '',
  ProgrammerVenueContactId: null,
  ROTTPercentage: null,
  PRSPercentage: null,
  Guarantee: null,
  GuaranteeAmount: null,
  HasCalls: null,
  PromoterSplitPercentage: null,
  VenueSplitPercentage: null,
  VenueRental: null,
  VenueRentalNotes: '',
  StaffingContra: null,
  StaffingContraNotes: '',
  AgreedContraItems: null,
  AgreedContraItemsNotes: '',
  BOMVenueContactId: null,
  OnSaleDate: null,
  SettlementVenueContactId: null,
  SellableSeats: null,
  MixerDeskPosition: '',
  StandardSeatKills: '',
  RestorationLevy: null,
  BookingFees: null,
  CCCommissionPercent: null,
  TxnChargeOption: '',
  TxnChargeAmount: null,
  AgreedDiscounts: '',
  MaxTAAlloc: '',
  TAAlloc: '',
  TicketCopy: '',
  ProducerCompCount: null,
  OtherHolds: '',
  AgeNotes: '',
  SalesDayNum: null,
  MMVenueContactId: null,
  BrochureDeadline: null,
  FinalProofBy: null,
  PrintReqs: '',
  LocalMarketingBudget: null,
  LocalMarketingContra: null,
  SellWho: '',
  SellProgrammes: null,
  SellMerch: null,
  SellNotes: '',
  SellProgCommPercent: null,
  SellMerchCommPercent: null,
  SellPitchFee: null,
  TechVenueContactId: null,
  TechArrivalDate: null,
  TechArrivalTime: null,
  NumDressingRooms: null,
  NumFacilitiesLaundry: null,
  NumFacilitiesDrier: null,
  NumFacilitiesLaundryRoom: null,
  NumFacilitiesNotes: '',
  NumCateringNotes: '',
  BarringClause: '',
  AdvancePaymentRequired: null,
  AdvancePaymentAmount: null,
  AdvancePaymentDueBy: null,
  SettlementDays: null,
  ContractClause: '',
};

export const salaryPaidToOptions = [
  {
    text: 'Agent',
    value: 'A',
  },
  {
    text: 'Company Member',
    value: 'C',
  },
];

export const workTypeOptions = [
  { text: 'Actor', value: 1 },
  { text: 'Actor-Musician', value: 2 },
  { text: 'Assistant Stage Manager (ASM)', value: 3 },
  { text: 'Chaperone', value: 4 },
  { text: 'Choreographer', value: 5 },
  { text: 'Company Manager (CM)', value: 6 },
  { text: 'Conductor', value: 7 },
  { text: 'Costume Designer', value: 8 },
  { text: 'Dancer', value: 9 },
  { text: 'Deputy Stage Manager (DSM)', value: 10 },
  { text: 'Director', value: 11 },
  { text: 'Driver', value: 12 },
  { text: 'Flyman', value: 13 },
  { text: 'Lighting Designer (LD)', value: 14 },
  { text: 'Magician', value: 15 },
  { text: 'Make Up', value: 16 },
  { text: 'Musician', value: 17 },
  { text: 'Production Manager (PM)', value: 18 },
  { text: 'Puppeteer', value: 19 },
  { text: 'Set Designer', value: 20 },
  { text: 'Singer', value: 21 },
  { text: 'Sound Designer', value: 22 },
  { text: 'Sound Engineer', value: 23 },
  { text: 'Stage Crew', value: 24 },
  { text: 'Stage Manager (SM)', value: 25 },
  { text: 'Technical Manager (TM)', value: 26 },
  { text: 'Technical Stage Manager (TSM)', value: 27 },
  { text: 'Technician – general', value: 28 },
  { text: 'Technician – LX bias', value: 29 },
  { text: 'Technician – Sound bias', value: 30 },
  { text: 'Technician – Video bias', value: 31 },
  { text: 'Video Designer', value: 32 },
  { text: 'Wardrobe', value: 33 },
  { text: 'Wigs', value: 34 },
  { text: 'Writer', value: 35 },
];

export const paymentTypes = [
  {
    text: 'Weekly Payment',
    value: 'W',
  },
  {
    text: 'Total Fee',
    value: 'O',
  },
];

export const contractDepartmentOptions = [
  {
    text: 'Artiste',
    value: 1,
  },
  {
    text: 'Creative',
    value: 2,
  },
  {
    text: 'SM / Tech / Crew',
    value: 3,
  },
];

export enum CompanyContractStatus {
  NotYetIssued = 'CNI',
  Issued = 'CI',
  QuestionsRaised = 'CIQR',
  SignedAndReturned = 'CSR',
  Overdue = 'CO',
  Voided = 'O',
  Cancelled = 'X',
}

export const companyContractStatusOrder = {
  [CompanyContractStatus.Overdue]: 1,
  [CompanyContractStatus.QuestionsRaised]: 2,
  [CompanyContractStatus.Issued]: 3,
  [CompanyContractStatus.NotYetIssued]: 4,
  [CompanyContractStatus.SignedAndReturned]: 5,
  [CompanyContractStatus.Voided]: 6,
  [CompanyContractStatus.Cancelled]: 7,
};

export const companyContractStatusOptions = [
  {
    text: 'Not Yet Issued',
    value: CompanyContractStatus.NotYetIssued,
  },
  {
    text: 'Issued',
    value: CompanyContractStatus.Issued,
  },
  {
    text: 'Questions Raised',
    value: CompanyContractStatus.QuestionsRaised,
  },
  {
    text: 'Signed and Returned',
    value: CompanyContractStatus.SignedAndReturned,
  },
  {
    text: 'Overdue',
    value: CompanyContractStatus.Overdue,
  },
  {
    text: 'Voided',
    value: CompanyContractStatus.Voided,
  },
  {
    text: 'Cancelled',
    value: CompanyContractStatus.Cancelled,
  },
];

export const statusToBgColorMap = {
  [CompanyContractStatus.NotYetIssued]: {
    backgroundColor: 'white',
  },
  [CompanyContractStatus.Issued]: {
    backgroundColor: '#FFE606',
  },
  [CompanyContractStatus.QuestionsRaised]: {
    backgroundColor: '#FF7E07',
    color: 'white',
  },
  [CompanyContractStatus.SignedAndReturned]: {
    backgroundColor: '#10841C',
    color: 'white',
  },
  [CompanyContractStatus.Overdue]: {
    backgroundColor: '#ED1111',
    color: 'white',
  },
};
