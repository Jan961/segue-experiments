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
  { text: 'Call multiple', value: 'CM' },
  { text: 'First Call Against Split', value: 'FCAS' },
];
export const allStatusOptions: SelectOption[] = [{ text: 'All', value: 'all' }, ...statusOptions];

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
