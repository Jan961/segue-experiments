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
  Interval?: string;
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
};

export type GetInFitUpDTO = {
  Id: number;
  VenueId: number;
  Date: string;
  StatusCode: StatusCode;
};

export type RehearsalDTO = {
  Id?: number;
  Date: string;
  Town: string;
  StatusCode?: string;
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
};

export type ProductionDTO = {
  Id?: number;
  ShowId: number;
  Code: string;
  ShowName: string;
  ShowCode: string;
  IsArchived: boolean;
  DateBlock: DateBlockDTO[];
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
  DateTypeId: number;
  DateTypeName?: string;
  StatusCode: StatusCode;
};

export type BookingWithVenueDTO = BookingDTO & {
  Venue: {
    Id: number;
    Code: string;
    Website: string;
    Name: string;
  };
  ProductionId?: number;
};

export type DateTypeDTO = {
  Id: number;
  Name: string;
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
  RoleId: number;
  VenueId?: number;
};

export type ActivityDTO = {
  Id: number;
  Date: string;
  Name: string;
  BookingId: number;
  ActivityTypeId: number;
  CompanyCost: number;
  VenueCost: number;
  FollowUpRequired: boolean;
  Notes: string;
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
