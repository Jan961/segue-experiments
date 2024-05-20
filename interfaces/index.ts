export type StatusCode = 'C' | 'U' | 'X';

export type Currency = {
  id: number;
  fullTitle: string;
  symbol: string;
  exchangeRate: number;
};

export type User = {
  UserId: number;
  UserCode: string;
  UserName: string;
  IsActive: string;
  emailAddress: string;
  password: string;
  accountId: string;
  accountOwner: string;
  accountAdmin: string;
  segueAdmin: string;
  updated_at: string;
  created_at: string;
};

// Existing show interface for old schema. Remove eventually
export type Show = {
  ShowId: number;
  Code: string;
  Name: string;
  ShowType: string;
  archived: boolean;
  deleted: boolean;
};

export type ShowDTO = {
  Id?: number;
  Code: string;
  Name: string;
  Type: string;
  IsArchived: boolean;
};

export type ProductionTaskDTO = {
  TaskName?: any;
  Id: number;
  ProductionId: number;
  Code: number;
  Name: string;
  Priority: number;
  Notes?: string;
  Progress: number;
  DueDate?: string;
  FollowUp?: string;
  CreatedDate?: string;
  Status?: string;
  AssignedBy?: string;
  AssignedTo?: string;
  StartByWeekNum?: number;
  CompleteByWeekNum?: number;
  CompleteByIsPostProduction: boolean;
  StartByIsPostProduction: boolean;
  AssignedToUserId?: number;
  StartDate?: string;
  CompleteDate?: string;
};

// Existing Production interface for old schema. Remove eventually
export type Production = {
  ProductionId: number;
  Code: string;
  Logo: string;
  ShowId: Show;
  ProductionStartDate: Date;
  ProductionEndDate: Date;
  Archived: boolean;
  RehearsalStartDate: Date;
  RehearsalEndDate: Date;
  Show: Show;
  ProductionTask: ProductionTaskDTO[];
};

export type BookingDTO = {
  ProductionId?: number;
  Id: number;
  Date: string;
  VenueId: number;
  VenueName?: string;
  StatusCode: StatusCode;
  PencilNum: number;
  DealNotes?: string;
  Notes?: string;
  MarketingDealNotes?: string;
  HoldNotes?: string;
  CompNotes?: string;
  CastRateTicketsArranged?: boolean;
  CastRateTicketsNotes?: string;
  PerformanceIds?: number[];
  RunTag: string;
  LandingPageURL: string;
  TicketsOnSale: boolean;
  TicketsOnSaleFromDate: string;
  MarketingPlanReceived: boolean;
  PrintReqsReceived: boolean;
  ContactInfoReceived: boolean;
  MarketingCostsStatus: string;
  MarketingCostsApprovalDate: string;
  MarketingCostsNotes: string;
};

export type ContractsDTO = {
  ProductionId?: number;
  Id: number;
  Date: string;
  VenueId: number;
  VenueName?: string;
  StatusCode: StatusCode;
  PencilNum: number;
  DealNotes?: string;
  Notes?: string;
  MarketingDealNotes?: string;
  HoldNotes?: string;
  CompNotes?: string;
  CastRateTicketsArranged?: boolean;
  PerformanceIds?: number[];
  RunTag: string;
  LandingPageURL: string;
  CastRateTicketsNotes?: string;
  TicketsOnSale: boolean;
  TicketsOnSaleFromDate: string;
  MarketingPlanReceived: boolean;
  PrintReqsReceived: boolean;
  ContactInfoReceived: boolean;
};

export type GetInFitUpDTO = {
  Id: number;
  VenueId?: number; // check field name
  Date: string;
  StatusCode: string;
  Notes: string;
  PencilNum?: number;
  RunTag: string;
};

export type RehearsalDTO = {
  Id?: number;
  Date: string;
  VenueId: number;
  Town?: string;
  StatusCode?: string;
  Notes: string;
  DateType: number;
  DateBlockId?: number;
  PencilNum?: number;
  RunTag: string;
};

export type DateDTO = {
  Id: string;
  Booking?: BookingDTO[];
  Tech?: GetInFitUpDTO[];
  Rehearsal?: RehearsalDTO[];
};

export type DateBlockDTO = {
  Id?: number;
  Name: string;
  StartDate: string;
  EndDate: string;
  Dates?: DateDTO[];
  IsPrimary?: boolean;
  ProductionId?: number;
};

export interface FileDTO {
  id?: number;
  originalFilename: string;
  mediaType: string;
  location: string;
  uploadUserId: number;
  uploadDateTime: string;
  imageUrl?: string;
}

export type ProductionDTO = {
  Id?: number;
  ShowId: number;
  Code: string;
  ShowName: string;
  ShowCode: string;
  IsArchived: boolean;
  DateBlock: DateBlockDTO[];
  StartDate?: string;
  EndDate?: string;
  SalesEmail?: string;
  SalesFrequency?: string;
  RegionList?: number[];
  IsDeleted?: boolean;
  ImageUrl?: string;
  Image?: Partial<FileDTO>;
};

export type VenueMinimalDTO = {
  Id: number;
  Name: string;
  Code: string;
  Town?: string;
  Seats?: string;
  Count?: number;
};

export type OtherDTO = {
  Id: number;
  Date: string;
  DateTypeId: number; // check name ?
  DateTypeName?: string; // missing field at response
  StatusCode: StatusCode;
  Notes?: string;
  PencilNum?: number;
  RunTag: string;
};

export type VenueDTO = {
  Id: number;
  Code: string;
  Website: string;
  Name: string;
};

export type BookingWithVenueDTO = BookingDTO & {
  Venue: VenueDTO;
  ProductionId?: number;
};

export type DateTypeDTO = {
  Id: number;
  Name: string;
  Order: number;
};

export type PerformanceDTO = {
  Id: number;
  BookingId: number;
  Date: string;
  Time?: string;
};

export type VenueContactDTO = {
  Id: number;
  FirstName: string;
  LastName: string;
  Phone: string;
  Email: string;
  VenueRoleId: number;
  VenueId?: number;
};

export type ActivityDTO = {
  Id?: number;
  Date: Date | string;
  Name: string;
  BookingId: number;
  ActivityTypeId: number;
  CompanyCost: number;
  VenueCost: number;
  FollowUpRequired: boolean;
  DueByDate?: Date | string;
  Notes: string;
};

export type ActivityTypeDTO = {
  Name: string;
  Id: number;
};

export type BookingContactNoteDTO = {
  Id?: number;
  BookingId: number;
  CoContactName: string;
  ContactDate: string;
  ActionByDate: string;
  Notes: string;
};

export type AllocatedHoldDTO = {
  Id?: number;
  AvailableCompId: number;
  TicketHolderName: string;
  Seats: number;
  Comments?: string;
  RequestedBy?: string;
  ArrangedBy?: string;
  VenueConfirmationNotes?: string;
  TicketHolderEmail?: string;
  SeatsAllocated?: string;
};

export type VenueRoleDTO = {
  Id: number;
  Name: string;
  Standard: boolean;
};

export type UserDto = {
  Id?: number;
  Email: string;
  FirstName: string;
  LastName?: string;
};

export type Venue = {
  Longitude: any;
  Latitude: any;
  VenueId: number;
  Code: string;
  Name: string;
  Website: string | null;
  VenueFamily: string | null;
  Address1: string | null;
  Address2: string | null;
  Address3: string | null;
  Town: string | null;
  County: string | null;
  Postcode: string | null;
  Country: string | null;
  Currency: string;
  VATIndicator: boolean;
  TechSpecsURL: string | null;
  Seats: number | null;
  BarringClause: string | null;
  TownPopulation: number | null;
  Notes: string | null;
  DeliveryAddress1: string | null;
  DeliveryAddress2: string | null;
  DeliveryAddress3: string | null;
  DeliveryTown: string | null;
  DeliveryCounty: string | null;
  DeliveryPostcode: string | null;
  DeliveryCountry: string | null;
  LXDesk: string | null;
  LXNotes: string | null;
  SoundDesk: string | null;
  SoundNotes: string | null;
  StageSize: string | null;
  GridHeight: string | null;
  VenueFlags: string | null;
  PlaceID: string | null;
  BarringWeeksPre: number | null;
  BarringWeeksPost: number | null;
  BarringMiles: number | null;
  CulturallyExempt: boolean;
  VenueWarningNote: string | null;
  VenueStatus: string;
  deleted: number | null;
  updated_at: Date;
  created_at: Date;
  // Define related types if needed
};
export type VenueTechnicalInfo = {
  id: number;
  venue: Venue;
  techSpecUrl: string;
  stageSize: string;
  gridHeight: string;
  lxDesk: string;
  lsDeskNotes: string;
  SoundDesk: string;
  soundDeskNotes: string;
  flags: string;
};

export type Barring = {
  id: number;
  venue: Venue;
  barringClauseTitle: string;
  barringWeeksPrior: number;
  barringWeeksPost: number;
  barringMiles: number;
};

export type BarringVenue = {
  id: number;
  showVenue: Venue;
  barredVenue: Venue;
};

export enum intervalEnum {
  'once',
  'daily',
  'monthly',
  'yearly',
}

export interface IContractDetails {
  Artifacts: Blob;
  BarringClauseBreaches: string;
}
export interface IBookingDetails {
  BankDetailsReceived: string;
  BarringExemptions: null | any;
  ContractCheckedBy: string;
  ContractNotes: null | any;
  ContractReceivedBackDate: null | any;
  ContractReturnDate: string;
  ContractSignedBy: string;
  ContractSignedDate: string;
  CrewNotes: string;
  DealType: string;
  GP: null | any;
  MarketingDealNotes: string;
  RoyaltyPC: string | null;
  ShowDate: string;
  TicketPriceNotes: string;
  VenueContractStatus: string;
  PreShow?: number;
  PostShow?: number;
  BarringClause?: string;
  BarringMiles?: number;
  MerchandiseNotes?: string;
}

export interface IAttachedFile {
  Description: string;
  FileContent: {
    data: Buffer;
    type: string;
    [key: string]: any;
  };
  FileDT: string;
  FileId: number;
  OriginalFilename: string;
  OwnerId: number;
  OwnerType: string;
  UploadedDT: string;
}

export interface IFileData {
  description: string;
  originalFilename: string;
  fileDT: Date;
  fileContent: any;
}

export type ContractStatusType = {
  ContractNotes: string;
  BookingId: number;
  StatusCode: string;
  SignedDate: Date;
  SignedBy: string;
  ReturnDate: Date;
  CheckedBy: string;
  RoyaltyPercentage: string;
  DealType: string;
  Notes: string;
  ReceivedBackDate: Date;
  Exceptions: string;
};

export type ContractBookingStatusType = {
  DateBlockId: number;
  VenueId: number;
  FirstDate: Date;
  StatusCode: string;
  PencilNum: number;
  LandingPageURL: string;
  TicketsOnSaleFromDate: Date;
  TicketsOnSale: boolean;
  MarketingPlanReceived: boolean;
  ContactInfoReceived: boolean;
  PrintReqsReceived: boolean;
  Notes: string;
  DealNotes: string;
  TicketPriceNotes: string;
  MarketingDealNotes: string;
  CrewNotes: string;
  SalesNotes: string;
  HoldNotes: string;
  CompNotes: string;
  MerchandiseNotes: string;
  CastRateTicketNotes: string;
  CastRateTicketsArranged: boolean;
  CastRateTicketsNotes: string;
  RunTag: string;
  MarketingCostsStatus: string;
  MarketingCostsApprovalDate: Date;
  MarketingCostsNotes: string;
};

export interface ContractTableRowType {
  [x: string]: any;
  Id: number | null;
  bookingStatus: string | null;
  capacity: number | null;
  contractStatus: string | null;
  count: number | null;
  date: string | null;
  dateTime: string | null;
  dayType: string | null;
  isRehearsal: boolean;
  note: string | null;
  pencilNo: number | null;
  production: string | null;
  productionId: number | null;
  productionName: string | null;
  runTag: number | null;
  status: string | null;
  town: string | null;
  venue: string | null;
  venueId: number | null;
  week: number | null;
}
export interface VenueContractFormData {
  StatusCode: string;
  SignedDate: Date;
  ReturnDate: Date;
  ReceivedBackDate: Date;
  DealType: string;
  bookingNotes: string;
  TicketPriceNotes: string;
  MarketingDealNotes: string;
  CrewNotes: string;
  Exceptions: string;
  Notes: string;
  MerchandiseNotes: string;
  RoyaltyPercentage: string;
  performanceTimes: string;
  performanceCount: string;
  DealNotes: string;
  status: string;
}

export interface SaveContractFormState {
  StatusCode?: string;
  SignedDate?: Date;
  ReturnDate?: Date;
  ReceivedBackDate?: Date;
  DealType?: string;
  bookingNotes?: string;
  Exceptions?: string;
  Notes?: string;
}

export interface SaveContractBookingFormState {
  MerchandiseNotes?: string;
  CrewNotes?: string;
  MarketingDealNotes?: string;
  TicketPriceNotes?: string;
}
