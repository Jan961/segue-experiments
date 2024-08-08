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
  { text: 'YES', value: 1 },
  { text: 'NO', value: 2 },
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
  { text: 'Monday', value: 1 },
  { text: 'Tuesday', value: 2 },
  { text: 'Wednesday', value: 3 },
  { text: 'Thursday', value: 4 },
  { text: 'Friday', value: 5 },
  { text: 'Saturday', value: 6 },
  { text: 'Sunday', value: 7 },
];

export const transactionOptions = [
  { text: 'Per Ticket', value: '1' },
  { text: 'Per Transaction', value: '2' },
];

export const sellerOptions = [
  { text: 'PRODUCTION', value: '1' },
  { text: 'VENUE', value: '2' },
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
