// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import { User } from 'path/to/interfaces';
import {number} from "prop-types";

export type StatusCode = 'C' | 'U' | 'X'

export type Currency = {
  id: number
  fullTitle: string
  symbol: string
  exchangeRate: number
}

export type User = {
  UserId: number
  UserCode: string
  UserName: string
  IsActive: string
  emailAddress: string
  password: string
  accountId: string
  accountOwner: string
  accountAdmin: string
  segueAdmin: string
  updated_at: string
  created_at: string

}

// Existing show interface for old schema. Remove eventually
export  type Show = {
  ShowId: number
  Code: string
  Name: string
  ShowType: string
  archived: boolean
  deleted: boolean
}

export type ShowDTO = {
  Id?: number
  Code: string
  Name: string
  Type: string
  IsArchived: boolean
}

// Existing tour interface for old schema. Remove eventually
export type Tour = {
  TourId: number
  Code: string
  Logo: string
  ShowId: Show
  TourStartDate: Date
  TourEndDate: Date
  Archived: boolean
  RehearsalStartDate: Date
  RehearsalEndDate: Date
  Show: Show
  TourTask: TourTaskDTO[]
}

export type TourDTO = {
  Id?: number
  ShowId: number
  Code: string
  ShowName: string
  ShowCode: string
  IsArchived: boolean
  DateBlock: DateBlockDTO[]
}

export type RehearsalDTO = {
  Id?: number
  Date: string
  Town: string
  StatusCode?: string
}

export type VenueMinimalDTO = {
  Id: number
  Name: string
  Code: string
}

export type GetInFitUpDTO = {
  Id: number
  VenueId: number
  Date: string
  StatusCode: StatusCode
}

export type OtherDTO = {
  Id: number
  Date: string
  DateTypeId: number
  StatusCode: StatusCode
}

export type BookingDTO = {
  Id: number
  Date: string
  VenueId: number
  VenueName?: string
  StatusCode: StatusCode
  PencilNum: number
  DealNotes?:string,
  Notes?: string,
  MarketingDealNotes?:string,
  HoldNotes?:string,
  CompNotes?:string
}

export type BookingWithVenueDTO = BookingDTO & {
  Venue: {
    Code: string
    Website: string
    Name: string
  }
  TourId?:number
}

export type DateTypeDTO = {
  Id: number
  Name: string
}

export type PerformanceDTO = {
  Id: number
  BookingId: number
  Date: string
  Time?: string
}

export type DateDTO = {
  Id: string
  Booking?: BookingDTO[]
  Tech?: GetInFitUpDTO[]
  Rehearsal?: RehearsalDTO[]
}

export type DateBlockDTO = {
  Id?: number
  Name: string
  StartDate: string
  EndDate: string
  Dates?: DateDTO[]
}

export type VenueContactDTO = {
  Id: number
  FirstName: string
  LastName: string
  Phone: string
  Email: string
  RoleId: number
  VenueId?: number
}

export type ActivityDTO = {
  Id: number
  Date: string
  Name: string
  BookingId: number
  ActivityTypeId: number
  CompanyCost: number
  VenueCost: number
  FollowUpRequired: boolean
}

export type BookingContactNoteDTO = {
  Id?: number
  BookingId: number
  CoContactName: string
  ContactDate: string
  ActionByDate: string
  Notes: string
}

export type AllocatedHoldDTO = {
  Id?: number
  AvailableCompId: number
  TicketHolderName: string
  Seats: number
  Comments?: string
  RequestedBy?: string
  ArrangedBy?: string
  VenueConfirmationNotes?: string
  TicketHolderEmail?: string
  SeatsAllocated?: string
}

export type VenueRoleDTO = {
  Id: number
  Name: string
}

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
  id: number
  venue: Venue
  techSpecUrl: string
  stageSize: string
  gridHeight: string
  lxDesk: string
  lsDeskNotes: string
  SoundDesk: string
  soundDeskNotes: string
  flags: string
}

export type Barring = {
  id: number
  venue: Venue
  barringClauseTitle: string
  barringWeeksPrior: number
  barringWeeksPost: number
  barringMiles: number
}

export type BarringVenue = {
  id: number
  showVenue: Venue
  barredVenue: Venue
}

export type TourTaskDTO = {
  Id: number
  TourId: number
  Code: number
  Name: string
  Priority: number
  Notes?: string
  Progress: number
  DueDate?: string
  FollowUp?: string
  CreatedDate?: string
  Status?: string
  Interval: string
  AssignedBy?: string
  AssignedTo?: string
  StartByWeekNum?: number
  CompleteByWeekNum?: number
  CompleteByPostTour: boolean
  StartByPostTour: boolean
}

enum intervalEnum {
  'once', 'daily', 'monthly', 'yearly'
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
};
