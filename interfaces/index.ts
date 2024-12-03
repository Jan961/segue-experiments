import { UTCDate } from '@date-fns/utc';
import { DealMemoHold, DealMemoPrice, Region } from 'prisma/generated/prisma-client';

export type StatusCode = 'C' | 'U' | 'X';

export type Currency = {
  id: number;
  fullTitle: string;
  symbol: string;
  exchangeRate: number;
};

export type CountryInRegion = {
  CountryId: number;
  RegionId: number;
};

export type CountryDTO = {
  Id: number;
  Name: string;
  Code: string;
  CurrencyCode?: string;
  RegionList?: Region[];
};

export type CurrencyDTO = {
  CurrencyCode: string;
  CurrencyName: string;
  CurrencySymbolUnicode: string;
  CurrencyCountryList: CountryDTO[];
};

export interface ICurrency {
  code: string;
  name: string;
  symbolUniCode: string;
}

export interface IRegion {
  id: number;
  name: string;
}

export interface ICurrencyCountry {
  id: number;
  code: string;
  name: string;
  currencyCode: string;
  regionList: IRegion[];
}

export type UICurrency = {
  code: number;
  name: string;
  symbolUnicode: string;
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
  TaskAssignedToAccUserId?: number;
  StartDate?: string;
  CompleteDate?: string;
  TaskCompletedDate: UTCDate;
  ProductionTaskRepeat?: any;
  PRTId?: number;
  CopiedFrom?: string;
  CopiedId?: number;
};

export type MasterTaskDTO = {
  TaskName?: any;
  Id?: number;
  Code?: number;
  Name: string;
  Priority?: number;
  Notes?: string;
  DueDate?: string;
  FollowUp?: string;
  CreatedDate?: string;
  Status?: string;
  AssignedBy?: string;
  AssignedTo?: string;
  StartByWeekNum?: number;
  CompleteByWeekNum?: number;
  TaskAssignedToAccUserId?: number;
  MasterTaskRepeat?: any;
  MTRId?: number;
  RepeatInterval?: string;
  TaskRepeatFromWeekNum?: number;
  TaskRepeatToWeekNum?: number;
  AccountId?: number;
  TaskStartByIsPostProduction?: boolean;
  TaskEndByIsPostProduction?: boolean;
};

// Existing Production interface for old schema. Remove eventually
export type Production = {
  ProductionId: number;
  Code: string;
  Logo: string;
  ShowId: Show;
  ProductionStartDate: UTCDate;
  ProductionEndDate: UTCDate;
  Archived: boolean;
  RehearsalStartDate: UTCDate;
  RehearsalEndDate: UTCDate;
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
  BookingSalesNotes: string;
  BookingCompNotes: string;
  BookingHoldNotes: string;
  PerformanceCount: number;
  BookingFinalSalesDiscrepancyNotes: string;
  BookingHasSchoolsSales: boolean;
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

export type AccountContactDTO = {
  AccContId: number;
  AccContAccountId: number;
  AccContFirstName: string;
  AccContLastName: string;
  AccContPhone: string;
  AccContMainEmail: string;
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

export interface ProductionCompanyDTO {
  ProdCoAccountId?: number;
  ProdCoId?: number;
  ProdCoLogoFileId?: number;
  ProdCoName?: string;
  ProdCoSaleStartWeek?: number;
  ProdCoVATCode?: string;
  ProdCoWebSite?: string;
}
export type ConversionRateDTO = {
  Id: number;
  FromCurrencyCode: string;
  ToCurrencyCode: string;
  Rate: number;
  ProductionId: number;
  FromCurrency?: CurrencyDTO;
  ToCurrency?: CurrencyDTO;
};

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
  ShowRegionId?: number;
  ProductionCompany?: Partial<ProductionCompanyDTO>;
  ReportCurrencyCode?: string;
  RunningTime?: string;
  RunningTimeNote?: string;
  ProdCoId?: number;
  ConversionRateList?: Partial<ConversionRateDTO>[];
};

export type StandardClauseDTO = {
  id: number;
  text: string;
  title: string;
};

export type PersonMinimalDTO = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
};

export type TemplateMinimalDTO = {
  id: number;
  name: string;
  location: string;
};

export type VenueMinimalDTO = {
  Id: number;
  Name: string;
  Code: string;
  Town?: string;
  Seats?: string;
  Count?: number;
  RegionId?: number;
  CurrencyCode?: string;
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
  Date: UTCDate | string;
  Name: string;
  BookingId: number;
  ActivityTypeId: number;
  CompanyCost: number;
  VenueCost: number;
  FollowUpRequired: boolean;
  DueByDate?: UTCDate | string;
  Notes: string;
};

export type GlobalActivityDTO = {
  Id?: number;
  Date: UTCDate | string;
  Name: string;
  ProductionId: number;
  ActivityTypeId: number;
  Cost: number;
  FollowUpRequired: boolean;
  DueByDate?: UTCDate | string;
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
  Notes: string;
  ActionAccUserId: number;
};

export type AllocatedHoldDTO = {
  Id?: number;
  AvailableCompId: number;
  TicketHolderName: string;
  Seats: number;
  Comments?: string;
  RequestedBy?: string;
  ArrangedById?: string;
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
  AccUserId: number;
};

export type Venue = {
  Longitude: any;
  Latitude: any;
  VenueId: number;
  Code: string;
  Name: string;
  Website: string | null;
  FamilyId: number | null;
  VenueFamily: string | null;
  Address1: string | null;
  Address2: string | null;
  Address3: string | null;
  Town: string | null;
  County: string | null;
  Postcode: string | null;
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
  updated_at: UTCDate;
  created_at: UTCDate;
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
  fileDT: UTCDate;
  fileContent: any;
}

export type ContractStatusType = {
  ContractNotes: string;
  BookingId: number;
  StatusCode: string;
  SignedDate: UTCDate;
  SignedBy: string;
  ReturnDate: UTCDate;
  CheckedBy: string;
  RoyaltyPercentage: string;
  DealType: string;
  Notes: string;
  ReceivedBackDate: UTCDate;
  Exceptions: string;
  BankDetailsSent: boolean;
  TechSpecSent: boolean;
  PRSCertSent: boolean;
  GP: string;
  PromoterPercent: string;
};

export type ContractBookingStatusType = {
  DateBlockId: number;
  VenueId: number;
  FirstDate: UTCDate;
  StatusCode: string;
  PencilNum: number;
  LandingPageURL: string;
  TicketsOnSaleFromDate: UTCDate;
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
  CastRateTicketsArranged: boolean;
  CastRateTicketsNotes: string;
  RunTag: string;
  MarketingCostsStatus: string;
  MarketingCostsApprovalDate: UTCDate;
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

export interface StandardSeatRowType {
  type: string;
  seats: string;
  value: string;
  id: number | null;
  typeId: number;
}

export interface VenueContractFormData {
  StatusCode: string;
  SignedDate: UTCDate;
  ReturnDate: UTCDate;
  ReceivedBackDate: UTCDate;
  DealType: string;
  bookingNotes: string;
  TicketPriceNotes: string;
  MarketingDealNotes: string;
  CrewNotes: string;
  Exceptions: string;
  Notes: string;
  MerchandiseNotes: string;
  RoyaltyPercentage: string;
  PerformanceTimes: string[];
  performanceCount: string;
  DealNotes: string;
  status: string;
  SignedBy: string;
  CurrencyCode: string;
  FirstDate: string;
  Id: string;
  BankDetailsSent: boolean;
  TechSpecSent: boolean;
  PRSCertSent: boolean;
  GP: string;
  PromoterPercent: string;
}

export interface SaveContractFormState {
  StatusCode?: string;
  SignedDate?: UTCDate;
  ReturnDate?: UTCDate;
  ReceivedBackDate?: UTCDate;
  DealType?: string;
  bookingNotes?: string;
  Exceptions?: string;
  Notes?: string;
  SignedBy?: string;
}

export interface SaveContractBookingFormState {
  MerchandiseNotes?: string;
  CrewNotes?: string;
  MarketingDealNotes?: string;
  TicketPriceNotes?: string;
}

export interface ContactDemoFormData {
  phone: string;
  email: string;
  id: number;
}

export interface DealMemoCall {
  DMCId?: number;
  DMCDeMoId?: number;
  DMCCallNum?: number;
  DMCPromoterOrVenue?: string;
  DMCType?: string;
  DMCValue?: number;
}

export interface DealMemoTechProvision {
  DMTechName: string;
  DMTechVenue: string | null;
  DMTechCompany: string | null;
}

export interface DealMemoContractFormData {
  Id?: number;
  BookingId?: number;
  AccContId?: number;
  RunningTime?: UTCDate;
  DateIssued?: UTCDate;
  VatCode?: string;
  RunningTimeNotes?: string;
  PrePostShowEvents?: string;
  VenueCurfewTime?: UTCDate;
  PerformanceNotes?: string;
  ProgrammerVenueContactId?: number;
  ROTTPercentage?: number;
  PRSPercentage?: number;
  Guarantee?: boolean;
  GuaranteeAmount?: string;
  HasCalls?: boolean;
  PromoterSplitPercentage?: number;
  VenueSplitPercentage?: number;
  VenueRental?: string;
  VenueRentalNotes?: string;
  StaffingContra?: string;
  StaffingContraNotes?: string;
  AgreedContraItems?: string;
  AgreedContraItemsNotes?: string;
  BOMVenueContactId?: number;
  OnSaleDate?: UTCDate;
  SettlementVenueContactId?: number;
  SellableSeats?: number;
  MixerDeskPosition?: string;
  RestorationLevy?: string;
  BookingFees?: string;
  CCCommissionPercent?: number;
  TxnChargeOption?: string;
  TxnChargeAmount?: string;
  AgreedDiscounts?: string;
  MaxTAAlloc?: string;
  TAAlloc?: string;
  TicketCopy?: string;
  ProducerCompCount?: number;
  OtherHolds?: string;
  AgeNotes?: string;
  SalesDayNum?: number;
  MMVenueContactId?: number;
  BrochureDeadline?: UTCDate;
  FinalProofBy?: UTCDate;
  PrintReqs?: string;
  LocalMarketingBudget?: string;
  LocalMarketingContra?: string;
  SellWho?: string;
  SellProgrammes?: boolean;
  PrintDelUseVenueAddress?: boolean;
  PrintDelVenueAddressLine?: string;
  SellMerch?: boolean;
  MerchNotes?: string;
  SellProgCommPercent?: number;
  SellMerchCommPercent?: number;
  SellPitchFee?: string;
  TechVenueContactId?: number;
  TechArrivalDate?: UTCDate;
  TechArrivalTime?: UTCDate;
  DressingRooms?: string;
  NumFacilitiesLaundry?: boolean;
  NumFacilitiesDrier?: boolean;
  NumFacilitiesLaundryRoom?: boolean;
  NumFacilitiesNotes?: string;
  NumCateringNotes?: string;
  BarringClause?: string;
  AdvancePaymentRequired?: boolean;
  AdvancePaymentAmount?: string;
  AdvancePaymentDueBy?: UTCDate;
  SettlementDays?: number;
  ContractClause?: string;
  DealMemoPrice?: DealMemoPrice[];
  DealMemoTechProvision?: DealMemoTechProvision[];
  DealMemoCall?: any;
  DealMemoHold?: DealMemoHold[];
  Status?: string;
  CompletedBy?: string;
  ApprovedBy?: string;
  DateReturned?: UTCDate;
  Notes?: string;
  CompAccContId?: number;
  SendTo?: Array<number>;
  SettlementSameDay?: boolean;
  SeatKillNotes?: string;
}

export interface DealMemoHoldType {
  HoldTypeCode?: string;
  HoldTypeId?: number;
  HoldTypeName?: string;
  HoldTypeSeqNo?: number;
}

export interface DealMemoPriceType {
  DMPTicketName?: string;
  DMPTicketPrice: number;
  DMPNumTickets: number;
  DMPDeMoId: number;
  DMPNotes: string;
  DMPId?: number;
}

export interface UserPermission {
  permissionId: number;
  permissionName: string;
}

export interface ContractPermissionGroup {
  artisteContracts: boolean;
  creativeContracts: boolean;
  smTechCrewContracts: boolean;
}
