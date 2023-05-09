// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import { User } from 'path/to/interfaces';
import {number} from "prop-types";

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

export  type Show = {
  ShowId: number
  Code: string
  Name: string
  Logo: string
  ShowType: string
  owner: number
  archived: number
  published: number
  deleted: number
  updated_at: string
  created_at: string
}

export type Tour = {
  TourId: number;
  Code: string;
  logo: string;
  ShowId: Show;
  TourStartDate: Date;
  TourEndDate: Date;
  Archived: boolean;
  RehearsalStartDate: Date;
  RehearsalEndDate: Date;
  Show: Show;
  TourTask: [ITourTask];
}

// export type Venue = {
//   VenueId: number   //                                              Int                   @id @default(autoincrement())
//   Code: string   //                                                      String                @db.VarChar(6)
//   Name : string   //                                                     String                @db.VarChar(255)
//   Website : string   //                                                  String?               @db.VarChar(255)
//   VenueFamily  : string   //                                             String?               @db.VarChar(100)
//   Address1  : string   //                                                String?               @db.VarChar(50)
//   Address2 : string   //                                                 String?               @db.VarChar(50)
//   Address3 : string   //                                                 String?               @db.VarChar(50)
//   Town     : string   //                                                 String?               @db.VarChar(50)
//   County    : string   //                                                String?               @db.VarChar(50)
//   Postcode  : string   //                                                String?               @db.VarChar(12)
//   Country   : string   //                                                String?               @db.VarChar(30)
//   Currency   : string   //                                               String                @default("GBP") @db.VarChar(3)
//   VATIndicator  : boolean   //                                            Boolean               @default(dbgenerated("(b'0')")) @db.Bit(1)
//   TechSpecsURL : string   //                                             String?               @db.VarChar(255)
//   Seats      : number   //                                               Float?
//   BarringClause   : string   //                                          String?               @db.VarChar(255)
//   TownPopulation   : number   //                                         Float?
//   Notes           : string   //                                          String?               @db.VarChar(255)
//   DeliveryAddress1 : string   //                                         String?               @db.VarChar(50)
//   DeliveryAddress2 : string   //                                         String?               @db.VarChar(50)
//   DeliveryAddress3 : string   //                                         String?               @db.VarChar(50)
//   DeliveryTown     : string   //                                         String?               @db.VarChar(50)
//   DeliveryCounty   : string   //                                         String?               @db.VarChar(50)
//   DeliveryPostcode: string   //                                          String?               @db.VarChar(50)
//   DeliveryCountry    : string   //                                       String?               @db.VarChar(50)
//   LXDesk          : string   //                                          String?               @db.VarChar(50)
//   LXNotes        : string   //                                           String?               @db.VarChar(2000)
//   SoundDesk      : string   //                                           String?               @db.VarChar(50)
//   SoundNotes     : string   //                                           String?               @db.VarChar(2000)
//   StageSize      : string   //                                           String?               @db.VarChar(50)
//   GridHeight     : string   //                                           String?               @db.VarChar(50)
//   VenueFlags     : string   //                                           String?               @db.VarChar(2000)
//   PlaceID        : string   //                                           String?               @db.VarChar(255)
//   BarringWeeksPre   : number   //                                        Int?                  @db.TinyInt
//   BarringWeeksPost  :  number  //                                        Int?                  @db.TinyInt
//   BarringMiles      : number   //                                        Int?
//   CulturallyExempt  : boolean   //                                        Boolean               @default(false)
//   VenueWarningNote  : string   //                                        String?               @db.Text
//   VenueStatus      : string   //                                         String
//   source       : number   //                                            Int                   @default(0)
//   deleted       : number   //                                            Int                   @default(0)
//   updated_at   : string   //                                            DateTime              @default(now()) @db.Timestamp(0)
//   created_at    : string   //                                           DateTime              @default(now()) @db.Timestamp(0)
// }


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

export interface ITourTask {
  TourTaskId: number;
  TourId: number;
  TaskCode: number;
  TaskName: string;
  StartByWeekCode: string;
  CompleteByWeekCode: string;
  Priority: number;
  Notes?: string;
  DeptRCK: boolean;
  DeptMarketing: boolean;
  DeptProduction: boolean;
  DeptAccounts: boolean;
  Progress: number;
  DueDate?: Date;
  FollowUp?: Date;
  Assignee?: number;
  AssignedBy?: number;
  CreatedDate?: Date;
  Interval?: intervalEnum;
  User_TourTask_AssignedByToUser?: User;
  User_TourTask_AssigneeToUser?: User;
  Tour: Tour;
  Status: string,
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
