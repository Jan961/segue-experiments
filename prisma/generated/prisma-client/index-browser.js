Object.defineProperty(exports, '__esModule', { value: true });

const { Decimal, objectEnumValues, makeStrictEnum, Public, getRuntime } = require('./runtime/index-browser.js');

const Prisma = {};

exports.Prisma = Prisma;
exports.$Enums = {};

/**
 * Prisma Client JS version: 5.18.0
 * Query Engine version: 4c784e32044a8a016d99474bd02a3b6123742169
 */
Prisma.prismaVersion = {
  client: '5.18.0',
  engine: '4c784e32044a8a016d99474bd02a3b6123742169',
};

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.Decimal = Decimal;

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.validator = Public.validator;

/**
 * Extensions
 */
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`);
};

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull;
Prisma.JsonNull = objectEnumValues.instances.JsonNull;
Prisma.AnyNull = objectEnumValues.instances.AnyNull;

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull,
};

/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable',
});

exports.Prisma.ActivityTypeScalarFieldEnum = {
  Id: 'Id',
  Name: 'Name',
  ColourIndex: 'ColourIndex',
  Code: 'Code',
  OriginalActivityTypeId: 'OriginalActivityTypeId',
};

exports.Prisma.BookingScalarFieldEnum = {
  Id: 'Id',
  DateBlockId: 'DateBlockId',
  VenueId: 'VenueId',
  FirstDate: 'FirstDate',
  StatusCode: 'StatusCode',
  PencilNum: 'PencilNum',
  LandingPageURL: 'LandingPageURL',
  TicketsOnSaleFromDate: 'TicketsOnSaleFromDate',
  TicketsOnSale: 'TicketsOnSale',
  HasSchoolsSales: 'HasSchoolsSales',
  MarketingPlanReceived: 'MarketingPlanReceived',
  ContactInfoReceived: 'ContactInfoReceived',
  PrintReqsReceived: 'PrintReqsReceived',
  Notes: 'Notes',
  DealNotes: 'DealNotes',
  TicketPriceNotes: 'TicketPriceNotes',
  MarketingDealNotes: 'MarketingDealNotes',
  CrewNotes: 'CrewNotes',
  SalesNotes: 'SalesNotes',
  FinalSalesDiscrepancyNotes: 'FinalSalesDiscrepancyNotes',
  HoldNotes: 'HoldNotes',
  CompNotes: 'CompNotes',
  MerchandiseNotes: 'MerchandiseNotes',
  CastRateTicketsArranged: 'CastRateTicketsArranged',
  CastRateTicketsNotes: 'CastRateTicketsNotes',
  RunTag: 'RunTag',
  MarketingCostsStatus: 'MarketingCostsStatus',
  MarketingCostsApprovalDate: 'MarketingCostsApprovalDate',
  MarketingCostsNotes: 'MarketingCostsNotes',
  OriginalBookingId: 'OriginalBookingId',
};

exports.Prisma.BookingActivityScalarFieldEnum = {
  Id: 'Id',
  BookingId: 'BookingId',
  Date: 'Date',
  Name: 'Name',
  ActivityTypeId: 'ActivityTypeId',
  CompanyCost: 'CompanyCost',
  VenueCost: 'VenueCost',
  FollowUpRequired: 'FollowUpRequired',
  DueByDate: 'DueByDate',
  CreatedDT: 'CreatedDT',
  Notes: 'Notes',
};

exports.Prisma.BookingContactNotesScalarFieldEnum = {
  Id: 'Id',
  BookingId: 'BookingId',
  CoContactName: 'CoContactName',
  ContactDate: 'ContactDate',
  UserId: 'UserId',
  Notes: 'Notes',
};

exports.Prisma.ContractScalarFieldEnum = {
  BookingId: 'BookingId',
  StatusCode: 'StatusCode',
  SignedDate: 'SignedDate',
  SignedBy: 'SignedBy',
  ReturnDate: 'ReturnDate',
  CheckedBy: 'CheckedBy',
  RoyaltyPercentage: 'RoyaltyPercentage',
  DealType: 'DealType',
  Notes: 'Notes',
  ReceivedBackDate: 'ReceivedBackDate',
  Exceptions: 'Exceptions',
};

exports.Prisma.CurrencyScalarFieldEnum = {
  Code: 'Code',
  Name: 'Name',
  SymbolUnicode: 'SymbolUnicode',
};

exports.Prisma.DateTypeScalarFieldEnum = {
  Id: 'Id',
  Name: 'Name',
  DateTypeAffectsAvailability: 'DateTypeAffectsAvailability',
  SeqNo: 'SeqNo',
};

exports.Prisma.ShowScalarFieldEnum = {
  Id: 'Id',
  AccountId: 'AccountId',
  Code: 'Code',
  Name: 'Name',
  Type: 'Type',
  IsArchived: 'IsArchived',
};

exports.Prisma.VenueScalarFieldEnum = {
  Id: 'Id',
  Code: 'Code',
  Name: 'Name',
  StatusCode: 'StatusCode',
  Website: 'Website',
  VATIndicator: 'VATIndicator',
  TechSpecsURL: 'TechSpecsURL',
  Seats: 'Seats',
  BarringClause: 'BarringClause',
  TownPopulation: 'TownPopulation',
  LXDesk: 'LXDesk',
  LXNotes: 'LXNotes',
  SoundDesk: 'SoundDesk',
  SoundNotes: 'SoundNotes',
  StageSize: 'StageSize',
  GridHeight: 'GridHeight',
  VenueFlags: 'VenueFlags',
  BarringWeeksPre: 'BarringWeeksPre',
  BarringWeeksPost: 'BarringWeeksPost',
  BarringMiles: 'BarringMiles',
  CulturallyExempt: 'CulturallyExempt',
  VenueAccountId: 'VenueAccountId',
  IsDeleted: 'IsDeleted',
  VenueNotes: 'VenueNotes',
  VenueWarningNotes: 'VenueWarningNotes',
  ExcludeFromChecks: 'ExcludeFromChecks',
  FamilyId: 'FamilyId',
  AddressStageDoorW3W: 'AddressStageDoorW3W',
  AddressLoadingW3W: 'AddressLoadingW3W',
  OriginalVenueId: 'OriginalVenueId',
};

exports.Prisma.VenueBarredVenueScalarFieldEnum = {
  Id: 'Id',
  VenueId: 'VenueId',
  BarredVenueId: 'BarredVenueId',
};

exports.Prisma.VenueContactScalarFieldEnum = {
  Id: 'Id',
  VenueId: 'VenueId',
  FirstName: 'FirstName',
  LastName: 'LastName',
  Phone: 'Phone',
  Email: 'Email',
  Role: 'Role',
  RoleIndex: 'RoleIndex',
  VenueRoleId: 'VenueRoleId',
};

exports.Prisma.VenueRoleScalarFieldEnum = {
  Id: 'Id',
  Name: 'Name',
  IsStandard: 'IsStandard',
};

exports.Prisma.VenueVenueScalarFieldEnum = {
  Venue1Id: 'Venue1Id',
  Venue2Id: 'Venue2Id',
  Mileage: 'Mileage',
  TimeMins: 'TimeMins',
};

exports.Prisma.DateBlockScalarFieldEnum = {
  Id: 'Id',
  ProductionId: 'ProductionId',
  Name: 'Name',
  StartDate: 'StartDate',
  EndDate: 'EndDate',
  IsPrimary: 'IsPrimary',
};

exports.Prisma.GetInFitUpScalarFieldEnum = {
  Id: 'Id',
  DateBlockId: 'DateBlockId',
  VenueId: 'VenueId',
  StatusCode: 'StatusCode',
  Date: 'Date',
  Notes: 'Notes',
  PencilNum: 'PencilNum',
  RunTag: 'RunTag',
};

exports.Prisma.OtherScalarFieldEnum = {
  Id: 'Id',
  DateBlockId: 'DateBlockId',
  DateTypeId: 'DateTypeId',
  StatusCode: 'StatusCode',
  Date: 'Date',
  Notes: 'Notes',
  PencilNum: 'PencilNum',
  RunTag: 'RunTag',
};

exports.Prisma.PerformanceScalarFieldEnum = {
  Id: 'Id',
  BookingId: 'BookingId',
  Time: 'Time',
  Date: 'Date',
};

exports.Prisma.RehearsalScalarFieldEnum = {
  Id: 'Id',
  DateBlockId: 'DateBlockId',
  Town: 'Town',
  StatusCode: 'StatusCode',
  Date: 'Date',
  DateTypeId: 'DateTypeId',
  VenueId: 'VenueId',
  Notes: 'Notes',
  PencilNum: 'PencilNum',
  RunTag: 'RunTag',
};

exports.Prisma.AccountScalarFieldEnum = {
  AccountId: 'AccountId',
  AccountName: 'AccountName',
  AccountAddress1: 'AccountAddress1',
  AccountAddress2: 'AccountAddress2',
  AccountAddress3: 'AccountAddress3',
  AccountAddressTown: 'AccountAddressTown',
  AccountAddressCounty: 'AccountAddressCounty',
  AccountAddressPostcode: 'AccountAddressPostcode',
  AccountAddressCountry: 'AccountAddressCountry',
  AccountVATNumber: 'AccountVATNumber',
  AccountCurrencyCode: 'AccountCurrencyCode',
  AccountCompanyNumber: 'AccountCompanyNumber',
  AccountLogoFileId: 'AccountLogoFileId',
  AccountMainEmail: 'AccountMainEmail',
  AccountNumPeople: 'AccountNumPeople',
  AccountOrganisationId: 'AccountOrganisationId',
  AccountTermsAgreedBy: 'AccountTermsAgreedBy',
  AccountTermsAgreedDate: 'AccountTermsAgreedDate',
  AccountWebsite: 'AccountWebsite',
  AccountTypeOfCompany: 'AccountTypeOfCompany',
  AccountPhone: 'AccountPhone',
  AccountPaymentCurrencyCode: 'AccountPaymentCurrencyCode',
};

exports.Prisma.AvailableCompScalarFieldEnum = {
  Id: 'Id',
  PerformanceId: 'PerformanceId',
  Seats: 'Seats',
  AvailableCompNotes: 'AvailableCompNotes',
  OriginalAvailableHoldId: 'OriginalAvailableHoldId',
};

exports.Prisma.BookedVenueHistoryScalarFieldEnum = {
  BVHistoryId: 'BVHistoryId',
  BVBookingId: 'BVBookingId',
  BVVenueId: 'BVVenueId',
  BVUpdateDT: 'BVUpdateDT',
};

exports.Prisma.CompAllocationScalarFieldEnum = {
  Id: 'Id',
  AvailableCompId: 'AvailableCompId',
  TicketHolderName: 'TicketHolderName',
  Seats: 'Seats',
  Comments: 'Comments',
  RequestedBy: 'RequestedBy',
  ArrangedById: 'ArrangedById',
  VenueConfirmationNotes: 'VenueConfirmationNotes',
  TicketHolderEmail: 'TicketHolderEmail',
  SeatsAllocated: 'SeatsAllocated',
};

exports.Prisma.CompTypeScalarFieldEnum = {
  CompTypeId: 'CompTypeId',
  CompTypeName: 'CompTypeName',
  CompTypeCode: 'CompTypeCode',
  CompTypeSeqNo: 'CompTypeSeqNo',
  OriginalCompId: 'OriginalCompId',
};

exports.Prisma.ConversionRateScalarFieldEnum = {
  Id: 'Id',
  FromCurrencyCode: 'FromCurrencyCode',
  ToCurrencyCode: 'ToCurrencyCode',
  ProductionId: 'ProductionId',
  Rate: 'Rate',
};

exports.Prisma.HoldTypeScalarFieldEnum = {
  HoldTypeId: 'HoldTypeId',
  HoldTypeName: 'HoldTypeName',
  HoldTypeCode: 'HoldTypeCode',
  HoldTypeSeqNo: 'HoldTypeSeqNo',
  OriginalHoldId: 'OriginalHoldId',
};

exports.Prisma.ParsedEmailScalarFieldEnum = {
  ParsedEmailId: 'ParsedEmailId',
  ParsedEmailTo: 'ParsedEmailTo',
  ParsedEmailFrom: 'ParsedEmailFrom',
  ParsedEmailSubject: 'ParsedEmailSubject',
  ParsedEmailDate: 'ParsedEmailDate',
  ParsedEmailContent: 'ParsedEmailContent',
  ParsedEmailsCreatedAt: 'ParsedEmailsCreatedAt',
  ParsedEmailsUpdatedAt: 'ParsedEmailsUpdatedAt',
};

exports.Prisma.SaleScalarFieldEnum = {
  SaleId: 'SaleId',
  SaleSaleTypeId: 'SaleSaleTypeId',
  SaleSetId: 'SaleSetId',
  SaleSeats: 'SaleSeats',
  SaleValue: 'SaleValue',
};

exports.Prisma.SaleTypeScalarFieldEnum = {
  SaleTypeId: 'SaleTypeId',
  SaleTypeName: 'SaleTypeName',
};

exports.Prisma.SalesSetScalarFieldEnum = {
  SetId: 'SetId',
  SetBookingId: 'SetBookingId',
  SetPerformanceId: 'SetPerformanceId',
  SetSalesFiguresDate: 'SetSalesFiguresDate',
  SetBrochureReleased: 'SetBrochureReleased',
  SetSingleSeats: 'SetSingleSeats',
  SetNotOnSale: 'SetNotOnSale',
  SetIsFinalFigures: 'SetIsFinalFigures',
  SetFinalSalesApprovedByUser: 'SetFinalSalesApprovedByUser',
  SetIsCopy: 'SetIsCopy',
  OriginalBookingSaleId: 'OriginalBookingSaleId',
};

exports.Prisma.SetCompScalarFieldEnum = {
  SetCompId: 'SetCompId',
  SetCompSetId: 'SetCompSetId',
  SetCompCompTypeId: 'SetCompCompTypeId',
  SetCompSeats: 'SetCompSeats',
};

exports.Prisma.SetHoldScalarFieldEnum = {
  SetHoldId: 'SetHoldId',
  SetHoldSetId: 'SetHoldSetId',
  SetHoldHoldTypeId: 'SetHoldHoldTypeId',
  SetHoldSeats: 'SetHoldSeats',
  SetHoldValue: 'SetHoldValue',
};

exports.Prisma.BookingAttachedFileScalarFieldEnum = {
  FileId: 'FileId',
  FileBookingBookingId: 'FileBookingBookingId',
  FileDescription: 'FileDescription',
  FileOriginalFilename: 'FileOriginalFilename',
  FileDateTime: 'FileDateTime',
  FileUploadedDateTime: 'FileUploadedDateTime',
  FileContent: 'FileContent',
  FileURL: 'FileURL',
};

exports.Prisma.ContractAttachedFileScalarFieldEnum = {
  FileId: 'FileId',
  FileContractBookingId: 'FileContractBookingId',
  FileDescription: 'FileDescription',
  FileOriginalFilename: 'FileOriginalFilename',
  FileDateTime: 'FileDateTime',
  FileUploadedDateTime: 'FileUploadedDateTime',
  FileContent: 'FileContent',
};

exports.Prisma.VenueAddressScalarFieldEnum = {
  Id: 'Id',
  VenueId: 'VenueId',
  TypeName: 'TypeName',
  Line1: 'Line1',
  Line2: 'Line2',
  Line3: 'Line3',
  Town: 'Town',
  County: 'County',
  Postcode: 'Postcode',
  CountryId: 'CountryId',
  Phone: 'Phone',
  Email: 'Email',
};

exports.Prisma.UserScalarFieldEnum = {
  Id: 'Id',
  Email: 'Email',
  FirstName: 'FirstName',
  LastName: 'LastName',
  AccountId: 'AccountId',
};

exports.Prisma.AccountUserScalarFieldEnum = {
  Id: 'Id',
  UserId: 'UserId',
  AccountId: 'AccountId',
  AccUserIsAdmin: 'AccUserIsAdmin',
  AccUserPIN: 'AccUserPIN',
};

exports.Prisma.AccountUserPermissionScalarFieldEnum = {
  Id: 'Id',
  AccUserId: 'AccUserId',
  PermissionId: 'PermissionId',
};

exports.Prisma.PermissionScalarFieldEnum = {
  Id: 'Id',
  PermissionParentPermissionId: 'PermissionParentPermissionId',
  Name: 'Name',
  Description: 'Description',
  SeqNo: 'SeqNo',
};

exports.Prisma.TaskWatcherScalarFieldEnum = {
  WatcherId: 'WatcherId',
  WatcherProductionTaskId: 'WatcherProductionTaskId',
  WatcherUserId: 'WatcherUserId',
};

exports.Prisma.PerformanceReportScalarFieldEnum = {
  Id: 'Id',
  PerformanceId: 'PerformanceId',
  Act1UpTime: 'Act1UpTime',
  Act1DownTime: 'Act1DownTime',
  Interval1UpTime: 'Interval1UpTime',
  Interval1DownTime: 'Interval1DownTime',
  Act2UpTime: 'Act2UpTime',
  Act2DownTime: 'Act2DownTime',
  GetOutTime: 'GetOutTime',
  GetOutUpTime: 'GetOutUpTime',
  GetOutDownTime: 'GetOutDownTime',
  Absences: 'Absences',
  Illness: 'Illness',
  TechnicalNotes: 'TechnicalNotes',
  PerformanceNotes: 'PerformanceNotes',
  SetPropCostumeNotes: 'SetPropCostumeNotes',
  AudienceNotes: 'AudienceNotes',
  MerchandiseNotes: 'MerchandiseNotes',
  GeneralRemarks: 'GeneralRemarks',
};

exports.Prisma.DBSettingScalarFieldEnum = {
  DBSettingId: 'DBSettingId',
  DBSettingName: 'DBSettingName',
  DBSettingValue: 'DBSettingValue',
  DBSettingLastDataLoad: 'DBSettingLastDataLoad',
};

exports.Prisma.MasterTaskScalarFieldEnum = {
  Id: 'Id',
  AccountId: 'AccountId',
  Code: 'Code',
  Name: 'Name',
  CopiedFrom: 'CopiedFrom',
  CopiedId: 'CopiedId',
  Priority: 'Priority',
  Notes: 'Notes',
  AssignedToUserId: 'AssignedToUserId',
  StartByWeekNum: 'StartByWeekNum',
  TaskStartByIsPostProduction: 'TaskStartByIsPostProduction',
  CompleteByWeekNum: 'CompleteByWeekNum',
  TaskCompleteByIsPostProduction: 'TaskCompleteByIsPostProduction',
  MTRId: 'MTRId',
};

exports.Prisma.AccountUserProductionScalarFieldEnum = {
  AUPId: 'AUPId',
  AUPAccUserId: 'AUPAccUserId',
  AUPProductionId: 'AUPProductionId',
};

exports.Prisma.ProductionScalarFieldEnum = {
  Id: 'Id',
  ShowId: 'ShowId',
  Code: 'Code',
  SalesEmail: 'SalesEmail',
  IsArchived: 'IsArchived',
  IsDeleted: 'IsDeleted',
  SalesFrequency: 'SalesFrequency',
  RunningTime: 'RunningTime',
  RunningTimeNote: 'RunningTimeNote',
  LogoFileId: 'LogoFileId',
  ReportCurrencyCode: 'ReportCurrencyCode',
  ProdCoId: 'ProdCoId',
};

exports.Prisma.ProductionTaskScalarFieldEnum = {
  Id: 'Id',
  ProductionId: 'ProductionId',
  Code: 'Code',
  Name: 'Name',
  CopiedFrom: 'CopiedFrom',
  CopiedId: 'CopiedId',
  Priority: 'Priority',
  Notes: 'Notes',
  Progress: 'Progress',
  AssignedToUserId: 'AssignedToUserId',
  CompleteByIsPostProduction: 'CompleteByIsPostProduction',
  StartByWeekNum: 'StartByWeekNum',
  StartByIsPostProduction: 'StartByIsPostProduction',
  CompleteByWeekNum: 'CompleteByWeekNum',
  TaskCompletedDate: 'TaskCompletedDate',
  PRTId: 'PRTId',
};

exports.Prisma.AccountContactScalarFieldEnum = {
  AccContId: 'AccContId',
  AccContAccountId: 'AccContAccountId',
  AccContFirstName: 'AccContFirstName',
  AccContLastName: 'AccContLastName',
  AccContPhone: 'AccContPhone',
  AccContMainEmail: 'AccContMainEmail',
};

exports.Prisma.CountryScalarFieldEnum = {
  Id: 'Id',
  Code: 'Code',
  Name: 'Name',
  CurrencyCode: 'CurrencyCode',
};

exports.Prisma.CountryInRegionScalarFieldEnum = {
  CountryId: 'CountryId',
  RegionId: 'RegionId',
};

exports.Prisma.ProductionCompanyScalarFieldEnum = {
  Id: 'Id',
  AccountId: 'AccountId',
  Name: 'Name',
  WebSite: 'WebSite',
  ProdCoSaleStartWeek: 'ProdCoSaleStartWeek',
  ProdCoVATCode: 'ProdCoVATCode',
  ProdCoLogoFileId: 'ProdCoLogoFileId',
};

exports.Prisma.ProductionRegionScalarFieldEnum = {
  PRProductionId: 'PRProductionId',
  PRRegionId: 'PRRegionId',
};

exports.Prisma.RegionScalarFieldEnum = {
  Id: 'Id',
  Name: 'Name',
};

exports.Prisma.RehearsalDateTypeScalarFieldEnum = {
  RehearsalDateTypeId: 'RehearsalDateTypeId',
  RehearsalDateTypeName: 'RehearsalDateTypeName',
  RehearsalDateTypeAffectsAvailability: 'RehearsalDateTypeAffectsAvailability',
  RehearsalDateTypeSeqNo: 'RehearsalDateTypeSeqNo',
};

exports.Prisma.VenueFamilyScalarFieldEnum = {
  Id: 'Id',
  Name: 'Name',
};

exports.Prisma.DealMemoScalarFieldEnum = {
  DeMoId: 'DeMoId',
  DeMoBookingId: 'DeMoBookingId',
  DeMoDateIssued: 'DeMoDateIssued',
  DeMoAccContId: 'DeMoAccContId',
  DeMoRunningTime: 'DeMoRunningTime',
  DeMoRunningTimeNotes: 'DeMoRunningTimeNotes',
  DeMoPrePostShowEvents: 'DeMoPrePostShowEvents',
  DeMoVenueCurfewTime: 'DeMoVenueCurfewTime',
  DeMoPerformanceNotes: 'DeMoPerformanceNotes',
  DeMoProgrammerVenueContactId: 'DeMoProgrammerVenueContactId',
  DeMoVatCode: 'DeMoVatCode',
  DeMoROTTPercentage: 'DeMoROTTPercentage',
  DeMoPRSPercentage: 'DeMoPRSPercentage',
  DeMoGuarantee: 'DeMoGuarantee',
  DeMoGuaranteeAmount: 'DeMoGuaranteeAmount',
  DeMoHasCalls: 'DeMoHasCalls',
  DeMoPromoterSplitPercentage: 'DeMoPromoterSplitPercentage',
  DeMoVenueSplitPercentage: 'DeMoVenueSplitPercentage',
  DeMoVenueRental: 'DeMoVenueRental',
  DeMoVenueRentalNotes: 'DeMoVenueRentalNotes',
  DeMoStaffingContra: 'DeMoStaffingContra',
  DeMoStaffingContraNotes: 'DeMoStaffingContraNotes',
  DeMoAgreedContraItems: 'DeMoAgreedContraItems',
  DeMoAgreedContraItemsNotes: 'DeMoAgreedContraItemsNotes',
  DeMoBOMVenueContactId: 'DeMoBOMVenueContactId',
  DeMoOnSaleDate: 'DeMoOnSaleDate',
  DeMoSettlementVenueContactId: 'DeMoSettlementVenueContactId',
  DeMoSellableSeats: 'DeMoSellableSeats',
  DeMoMixerDeskPosition: 'DeMoMixerDeskPosition',
  DeMoStandardSeatKills: 'DeMoStandardSeatKills',
  DeMoRestorationLevy: 'DeMoRestorationLevy',
  DeMoBookingFees: 'DeMoBookingFees',
  DeMoCCCommissionPercent: 'DeMoCCCommissionPercent',
  DeMoTxnChargeOption: 'DeMoTxnChargeOption',
  DeMoTxnChargeAmount: 'DeMoTxnChargeAmount',
  DeMoAgreedDiscounts: 'DeMoAgreedDiscounts',
  DeMoMaxTAAlloc: 'DeMoMaxTAAlloc',
  DeMoTAAlloc: 'DeMoTAAlloc',
  DeMoTicketCopy: 'DeMoTicketCopy',
  DeMoProducerCompCount: 'DeMoProducerCompCount',
  DeMoOtherHolds: 'DeMoOtherHolds',
  DeMoAgeNotes: 'DeMoAgeNotes',
  DeMoSalesDayNum: 'DeMoSalesDayNum',
  DeMoMMVenueContactId: 'DeMoMMVenueContactId',
  DeMoBrochureDeadline: 'DeMoBrochureDeadline',
  DeMoFinalProofBy: 'DeMoFinalProofBy',
  DeMoPrintReqs: 'DeMoPrintReqs',
  DeMoLocalMarketingBudget: 'DeMoLocalMarketingBudget',
  DeMoLocalMarketingContra: 'DeMoLocalMarketingContra',
  DeMoSellWho: 'DeMoSellWho',
  DeMoSellProgrammes: 'DeMoSellProgrammes',
  DeMoSellMerch: 'DeMoSellMerch',
  DeMoSellNotes: 'DeMoSellNotes',
  DeMoSellProgCommPercent: 'DeMoSellProgCommPercent',
  DeMoSellMerchCommPercent: 'DeMoSellMerchCommPercent',
  DeMoSellPitchFee: 'DeMoSellPitchFee',
  DeMoTechVenueContactId: 'DeMoTechVenueContactId',
  DeMoTechArrivalDate: 'DeMoTechArrivalDate',
  DeMoTechArrivalTime: 'DeMoTechArrivalTime',
  DeMoDressingRooms: 'DeMoDressingRooms',
  DeMoNumFacilitiesLaundry: 'DeMoNumFacilitiesLaundry',
  DeMoNumFacilitiesDrier: 'DeMoNumFacilitiesDrier',
  DeMoNumFacilitiesLaundryRoom: 'DeMoNumFacilitiesLaundryRoom',
  DeMoNumFacilitiesNotes: 'DeMoNumFacilitiesNotes',
  DeMoNumCateringNotes: 'DeMoNumCateringNotes',
  DeMoBarringClause: 'DeMoBarringClause',
  DeMoAdvancePaymentRequired: 'DeMoAdvancePaymentRequired',
  DeMoAdvancePaymentAmount: 'DeMoAdvancePaymentAmount',
  DeMoAdvancePaymentDueBy: 'DeMoAdvancePaymentDueBy',
  DeMoSettlementDays: 'DeMoSettlementDays',
  DeMoContractClause: 'DeMoContractClause',
  DeMoPrintDelVenueAddressId: 'DeMoPrintDelVenueAddressId',
  DeMoPrintDelUseVenueAddress: 'DeMoPrintDelUseVenueAddress',
};

exports.Prisma.DealMemoCallScalarFieldEnum = {
  DMCId: 'DMCId',
  DMCDeMoId: 'DMCDeMoId',
  DMCCallNum: 'DMCCallNum',
  DMCPromoterOrVenue: 'DMCPromoterOrVenue',
  DMCType: 'DMCType',
  DMCValue: 'DMCValue',
};

exports.Prisma.DealMemoPriceScalarFieldEnum = {
  DMPId: 'DMPId',
  DMPDeMoId: 'DMPDeMoId',
  DMPTicketName: 'DMPTicketName',
  DMPNumTickets: 'DMPNumTickets',
  DMPTicketPrice: 'DMPTicketPrice',
  DMPNotes: 'DMPNotes',
};

exports.Prisma.DealMemoTechProvisionScalarFieldEnum = {
  DMTechId: 'DMTechId',
  DMTechDeMoId: 'DMTechDeMoId',
  DMTechName: 'DMTechName',
  DMTechVenue: 'DMTechVenue',
  DMTechCompany: 'DMTechCompany',
};

exports.Prisma.FileScalarFieldEnum = {
  Id: 'Id',
  OriginalFilename: 'OriginalFilename',
  MediaType: 'MediaType',
  Location: 'Location',
  UploadDateTime: 'UploadDateTime',
  UploadUserId: 'UploadUserId',
  SizeBytes: 'SizeBytes',
};

exports.Prisma.SubscriptionPlanScalarFieldEnum = {
  PlanId: 'PlanId',
  PlanName: 'PlanName',
  PlanDescription: 'PlanDescription',
  PlanPrice: 'PlanPrice',
  PlanFrequency: 'PlanFrequency',
  PlanPriceId: 'PlanPriceId',
  PlanCurrency: 'PlanCurrency',
};

exports.Prisma.AccountSubscriptionScalarFieldEnum = {
  AccSubId: 'AccSubId',
  AccSubAccountId: 'AccSubAccountId',
  AccSubPlanId: 'AccSubPlanId',
  AccSubStartDate: 'AccSubStartDate',
  AccSubEndDate: 'AccSubEndDate',
  AccSubIsActive: 'AccSubIsActive',
};

exports.Prisma.EmailTemplateScalarFieldEnum = {
  EmTemId: 'EmTemId',
  EmTemName: 'EmTemName',
  EmTemDescription: 'EmTemDescription',
  EmTemFrom: 'EmTemFrom',
  EmTemFields: 'EmTemFields',
};

exports.Prisma.GlobalBookingActivityScalarFieldEnum = {
  Id: 'Id',
  ProductionId: 'ProductionId',
  Date: 'Date',
  Name: 'Name',
  ActivityTypeId: 'ActivityTypeId',
  Cost: 'Cost',
  FollowUpRequired: 'FollowUpRequired',
  DueByDate: 'DueByDate',
  CreatedDT: 'CreatedDT',
  Notes: 'Notes',
};

exports.Prisma.ACCContractScalarFieldEnum = {
  ContractId: 'ContractId',
  PersonId: 'PersonId',
  RoleName: 'RoleName',
  ContractStatus: 'ContractStatus',
  CompletedByAccUserId: 'CompletedByAccUserId',
  CheckedByAccUserId: 'CheckedByAccUserId',
  DateIssued: 'DateIssued',
  DateReturned: 'DateReturned',
  Notes: 'Notes',
  CurrencyCode: 'CurrencyCode',
  FirstDay: 'FirstDay',
  LastDay: 'LastDay',
  Availability: 'Availability',
  RehearsalLocation: 'RehearsalLocation',
  RehearsalVenueId: 'RehearsalVenueId',
  RehearsalVenueNotes: 'RehearsalVenueNotes',
  IsAccomProvided: 'IsAccomProvided',
  AccomNotes: 'AccomNotes',
  IsTransportProvided: 'IsTransportProvided',
  TransportNotes: 'TransportNotes',
  IsNominatedDriver: 'IsNominatedDriver',
  NominatedDriverNotes: 'NominatedDriverNotes',
  PaymentType: 'PaymentType',
  WeeklyRehFee: 'WeeklyRehFee',
  WeeklyRehHolPay: 'WeeklyRehHolPay',
  WeeklyPerfFee: 'WeeklyPerfFee',
  WeeklyPerfHolPay: 'WeeklyPerfHolPay',
  WeeklySubs: 'WeeklySubs',
  WeeklySubsNotes: 'WeeklySubsNotes',
  TotalFee: 'TotalFee',
  TotalHolPay: 'TotalHolPay',
  TotalFeeNotes: 'TotalFeeNotes',
  CancelFee: 'CancelFee',
  ProductionId: 'ProductionId',
};

exports.Prisma.ACCContractPersonScalarFieldEnum = {
  ACCCPersonId: 'ACCCPersonId',
  ACCCPersonPersonId: 'ACCCPersonPersonId',
  ACCCPersonType: 'ACCCPersonType',
};

exports.Prisma.AddressScalarFieldEnum = {
  AddressId: 'AddressId',
  Address1: 'Address1',
  Address2: 'Address2',
  Address3: 'Address3',
  AddressTown: 'AddressTown',
  AddressCounty: 'AddressCounty',
  AddressPostcode: 'AddressPostcode',
};

exports.Prisma.DealMemoHoldScalarFieldEnum = {
  DMHoldId: 'DMHoldId',
  DMHoldDeMoId: 'DMHoldDeMoId',
  DMHoldHoldTypeId: 'DMHoldHoldTypeId',
  DMHoldSeats: 'DMHoldSeats',
  DMHoldValue: 'DMHoldValue',
};

exports.Prisma.GlobalBookingActivityVenueScalarFieldEnum = {
  GlobalActivityId: 'GlobalActivityId',
  VenueId: 'VenueId',
};

exports.Prisma.OrganisationScalarFieldEnum = {
  OrgId: 'OrgId',
  OrgName: 'OrgName',
  OrgWebsite: 'OrgWebsite',
  OrgContactPersonId: 'OrgContactPersonId',
};

exports.Prisma.PersonScalarFieldEnum = {
  PersonId: 'PersonId',
  PersonFirstName: 'PersonFirstName',
  PersonLastName: 'PersonLastName',
  PersonEmail: 'PersonEmail',
  PersonAddressId: 'PersonAddressId',
  PersonPhone: 'PersonPhone',
  PersonMobile: 'PersonMobile',
  PersonPassportName: 'PersonPassportName',
  PersonPassportExpiryDate: 'PersonPassportExpiryDate',
  PersonEligibleToWork: 'PersonEligibleToWork',
  PersonFEURequired: 'PersonFEURequired',
  PersonFEUCheckByUserId: 'PersonFEUCheckByUserId',
  PersonNotes: 'PersonNotes',
  PersonHealthNotes: 'PersonHealthNotes',
  PersonAdvisoryNotes: 'PersonAdvisoryNotes',
  PersonRoleNotes: 'PersonRoleNotes',
  PersonAgencyOrgId: 'PersonAgencyOrgId',
  PersonPaymentTo: 'PersonPaymentTo',
  PersonPaymentAccount: 'PersonPaymentAccount',
  PersonPaymentSortCode: 'PersonPaymentSortCode',
  PersonPaymentSWIFTBIC: 'PersonPaymentSWIFTBIC',
  PersonPaymentIBAN: 'PersonPaymentIBAN',
  PersonPaymentBankCountryId: 'PersonPaymentBankCountryId',
  PersonExpensesTo: 'PersonExpensesTo',
  PersonExpensesAccount: 'PersonExpensesAccount',
  PersonExpensesSortCode: 'PersonExpensesSortCode',
  PersonExpensesSWIFTBIC: 'PersonExpensesSWIFTBIC',
  PersonExpensesIBAN: 'PersonExpensesIBAN',
  PersonExpensesBankCountryId: 'PersonExpensesBankCountryId',
};

exports.Prisma.PersonOtherRoleScalarFieldEnum = {
  PORId: 'PORId',
  PORPersonId: 'PORPersonId',
  PORName: 'PORName',
};

exports.Prisma.PersonPersonRoleScalarFieldEnum = {
  PPPersonId: 'PPPersonId',
  PPPersonRoleId: 'PPPersonRoleId',
};

exports.Prisma.PersonRoleScalarFieldEnum = {
  PersonRoleId: 'PersonRoleId',
  PersonRoleName: 'PersonRoleName',
};

exports.Prisma.MasterTaskRepeatScalarFieldEnum = {
  Id: 'Id',
  FromWeekNum: 'FromWeekNum',
  FromWeekNumIsPostProduction: 'FromWeekNumIsPostProduction',
  ToWeekNum: 'ToWeekNum',
  ToWeekNumIsPostProduction: 'ToWeekNumIsPostProduction',
  Interval: 'Interval',
};

exports.Prisma.ProductionTaskRepeatScalarFieldEnum = {
  Id: 'Id',
  FromWeekNum: 'FromWeekNum',
  FromWeekNumIsPostProduction: 'FromWeekNumIsPostProduction',
  ToWeekNum: 'ToWeekNum',
  ToWeekNumIsPostProduction: 'ToWeekNumIsPostProduction',
  Interval: 'Interval',
};

exports.Prisma.VenueFileScalarFieldEnum = {
  Id: 'Id',
  VenueId: 'VenueId',
  FileId: 'FileId',
  Type: 'Type',
  Description: 'Description',
};

exports.Prisma.ACCPaymentScalarFieldEnum = {
  Id: 'Id',
  ACCContractId: 'ACCContractId',
  Date: 'Date',
  Amount: 'Amount',
  Notes: 'Notes',
};

exports.Prisma.ACCPubEventScalarFieldEnum = {
  Id: 'Id',
  ACCContractId: 'ACCContractId',
  Date: 'Date',
  Notes: 'Notes',
};

exports.Prisma.ACCStandardClauseScalarFieldEnum = {
  Id: 'Id',
  Text: 'Text',
};

exports.Prisma.PersonPersonScalarFieldEnum = {
  PPId: 'PPId',
  PPPersonId: 'PPPersonId',
  PPRoleType: 'PPRoleType',
  PPRolePersonId: 'PPRolePersonId',
};

exports.Prisma.ACCClauseScalarFieldEnum = {
  Id: 'Id',
  ACCContractId: 'ACCContractId',
  StdClauseId: 'StdClauseId',
  Text: 'Text',
};

exports.Prisma.ContractFileScalarFieldEnum = {
  Id: 'Id',
  ContractBookingId: 'ContractBookingId',
  FileId: 'FileId',
  Type: 'Type',
  Description: 'Description',
};

exports.Prisma.SalesSetTotalsViewScalarFieldEnum = {
  SetBookingId: 'SetBookingId',
  SetSalesFiguresDate: 'SetSalesFiguresDate',
  SetIsFinalFigures: 'SetIsFinalFigures',
  SaleTypeName: 'SaleTypeName',
  Seats: 'Seats',
  Value: 'Value',
};

exports.Prisma.VenueViewScalarFieldEnum = {
  VenueId: 'VenueId',
  VenueCode: 'VenueCode',
  VenueName: 'VenueName',
  VenueStatusCode: 'VenueStatusCode',
  VenueWebsite: 'VenueWebsite',
  VenueFamily: 'VenueFamily',
  VenueCurrencyCode: 'VenueCurrencyCode',
  VenueVATIndicator: 'VenueVATIndicator',
  VenueTechSpecsURL: 'VenueTechSpecsURL',
  VenueSeats: 'VenueSeats',
  VenueBarringClause: 'VenueBarringClause',
  VenueTownPopulation: 'VenueTownPopulation',
  VenueLXDesk: 'VenueLXDesk',
  VenueLXNotes: 'VenueLXNotes',
  VenueSoundDesk: 'VenueSoundDesk',
  VenueSoundNotes: 'VenueSoundNotes',
  VenueStageSize: 'VenueStageSize',
  VenueGridHeight: 'VenueGridHeight',
  VenueVenueFlags: 'VenueVenueFlags',
  VenueBarringWeeksPre: 'VenueBarringWeeksPre',
  VenueBarringWeeksPost: 'VenueBarringWeeksPost',
  VenueBarringMiles: 'VenueBarringMiles',
  VenueCulturallyExempt: 'VenueCulturallyExempt',
  VenueAccountId: 'VenueAccountId',
  VenueIsDeleted: 'VenueIsDeleted',
  VenueMainAddress1: 'VenueMainAddress1',
  VenueMainAddress2: 'VenueMainAddress2',
  VenueMainAddress3: 'VenueMainAddress3',
  VenueMainAddressTown: 'VenueMainAddressTown',
  VenueMainAddressCounty: 'VenueMainAddressCounty',
  VenueMainAddressPostcode: 'VenueMainAddressPostcode',
  VenueMainAddressCountry: 'VenueMainAddressCountry',
  VenueDeliveryAddress1: 'VenueDeliveryAddress1',
  VenueDeliveryAddress2: 'VenueDeliveryAddress2',
  VenueDeliveryAddress3: 'VenueDeliveryAddress3',
  VenueDeliveryAddressTown: 'VenueDeliveryAddressTown',
  VenueDeliveryAddressCounty: 'VenueDeliveryAddressCounty',
  VenueDeliveryAddressPostcode: 'VenueDeliveryAddressPostcode',
  VenueDeliveryAddressCountry: 'VenueDeliveryAddressCountry',
  VenueMainNoteText: 'VenueMainNoteText',
  VenueWarningNoteText: 'VenueWarningNoteText',
};

exports.Prisma.SalesViewScalarFieldEnum = {
  ShowName: 'ShowName',
  ProductionId: 'ProductionId',
  FullProductionCode: 'FullProductionCode',
  ProductionStartDate: 'ProductionStartDate',
  ProductionEndDate: 'ProductionEndDate',
  BookingId: 'BookingId',
  BookingFirstDate: 'BookingFirstDate',
  BookingStatusCode: 'BookingStatusCode',
  BookingProductionWeekNum: 'BookingProductionWeekNum',
  VenueTown: 'VenueTown',
  VenueCode: 'VenueCode',
  VenueName: 'VenueName',
  VenueCurrencyCode: 'VenueCurrencyCode',
  VenueCurrencySymbolUnicode: 'VenueCurrencySymbolUnicode',
  ConversionToCurrencyCode: 'ConversionToCurrencyCode',
  ConversionRate: 'ConversionRate',
  SetId: 'SetId',
  SetSalesFiguresDate: 'SetSalesFiguresDate',
  SetBookingWeekNum: 'SetBookingWeekNum',
  SetProductionWeekDate: 'SetProductionWeekDate',
  SetProductionWeekNum: 'SetProductionWeekNum',
  SetShowDayNum: 'SetShowDayNum',
  SetNotOnSale: 'SetNotOnSale',
  SetIsFinalFigures: 'SetIsFinalFigures',
  SetFinalSalesApprovedByUser: 'SetFinalSalesApprovedByUser',
  SetSingleSeats: 'SetSingleSeats',
  SetBrochureReleased: 'SetBrochureReleased',
  SetIsCopy: 'SetIsCopy',
  SaleTypeName: 'SaleTypeName',
  Seats: 'Seats',
  Value: 'Value',
  TotalCapacity: 'TotalCapacity',
  FinalFiguresDate: 'FinalFiguresDate',
  FinalFiguresSeats: 'FinalFiguresSeats',
  FinalFiguresValue: 'FinalFiguresValue',
  NotOnSaleDate: 'NotOnSaleDate',
  TotalHoldSeats: 'TotalHoldSeats',
  LastFiguresDate: 'LastFiguresDate',
  LastFiguresSeats: 'LastFiguresSeats',
  LastFiguresValue: 'LastFiguresValue',
};

exports.Prisma.BookingSelectionViewScalarFieldEnum = {
  BookingId: 'BookingId',
  BookingStatusCode: 'BookingStatusCode',
  BookingFirstDate: 'BookingFirstDate',
  VenueId: 'VenueId',
  VenueCode: 'VenueCode',
  VenueMainAddressTown: 'VenueMainAddressTown',
  ProductionId: 'ProductionId',
  FullProductionCode: 'FullProductionCode',
  ProductionLengthWeeks: 'ProductionLengthWeeks',
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc',
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last',
};

exports.Prisma.ModelName = {
  ActivityType: 'ActivityType',
  Booking: 'Booking',
  BookingActivity: 'BookingActivity',
  BookingContactNotes: 'BookingContactNotes',
  Contract: 'Contract',
  Currency: 'Currency',
  DateType: 'DateType',
  Show: 'Show',
  Venue: 'Venue',
  VenueBarredVenue: 'VenueBarredVenue',
  VenueContact: 'VenueContact',
  VenueRole: 'VenueRole',
  VenueVenue: 'VenueVenue',
  DateBlock: 'DateBlock',
  GetInFitUp: 'GetInFitUp',
  Other: 'Other',
  Performance: 'Performance',
  Rehearsal: 'Rehearsal',
  Account: 'Account',
  AvailableComp: 'AvailableComp',
  BookedVenueHistory: 'BookedVenueHistory',
  CompAllocation: 'CompAllocation',
  CompType: 'CompType',
  ConversionRate: 'ConversionRate',
  HoldType: 'HoldType',
  ParsedEmail: 'ParsedEmail',
  Sale: 'Sale',
  SaleType: 'SaleType',
  SalesSet: 'SalesSet',
  SetComp: 'SetComp',
  SetHold: 'SetHold',
  BookingAttachedFile: 'BookingAttachedFile',
  ContractAttachedFile: 'ContractAttachedFile',
  VenueAddress: 'VenueAddress',
  User: 'User',
  AccountUser: 'AccountUser',
  AccountUserPermission: 'AccountUserPermission',
  Permission: 'Permission',
  TaskWatcher: 'TaskWatcher',
  PerformanceReport: 'PerformanceReport',
  DBSetting: 'DBSetting',
  MasterTask: 'MasterTask',
  AccountUserProduction: 'AccountUserProduction',
  Production: 'Production',
  ProductionTask: 'ProductionTask',
  AccountContact: 'AccountContact',
  Country: 'Country',
  CountryInRegion: 'CountryInRegion',
  ProductionCompany: 'ProductionCompany',
  ProductionRegion: 'ProductionRegion',
  Region: 'Region',
  RehearsalDateType: 'RehearsalDateType',
  VenueFamily: 'VenueFamily',
  DealMemo: 'DealMemo',
  DealMemoCall: 'DealMemoCall',
  DealMemoPrice: 'DealMemoPrice',
  DealMemoTechProvision: 'DealMemoTechProvision',
  File: 'File',
  SubscriptionPlan: 'SubscriptionPlan',
  AccountSubscription: 'AccountSubscription',
  EmailTemplate: 'EmailTemplate',
  GlobalBookingActivity: 'GlobalBookingActivity',
  ACCContract: 'ACCContract',
  ACCContractPerson: 'ACCContractPerson',
  Address: 'Address',
  DealMemoHold: 'DealMemoHold',
  GlobalBookingActivityVenue: 'GlobalBookingActivityVenue',
  Organisation: 'Organisation',
  Person: 'Person',
  PersonOtherRole: 'PersonOtherRole',
  PersonPersonRole: 'PersonPersonRole',
  PersonRole: 'PersonRole',
  MasterTaskRepeat: 'MasterTaskRepeat',
  ProductionTaskRepeat: 'ProductionTaskRepeat',
  VenueFile: 'VenueFile',
  ACCPayment: 'ACCPayment',
  ACCPubEvent: 'ACCPubEvent',
  ACCStandardClause: 'ACCStandardClause',
  PersonPerson: 'PersonPerson',
  ACCClause: 'ACCClause',
  ContractFile: 'ContractFile',
  SalesSetTotalsView: 'SalesSetTotalsView',
  VenueView: 'VenueView',
  SalesView: 'SalesView',
  BookingSelectionView: 'BookingSelectionView',
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message;
        const runtime = getRuntime();
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message =
            'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' +
            runtime.prettyName +
            '`).';
        }

        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`;

        throw new Error(message);
      },
    });
  }
}

exports.PrismaClient = PrismaClient;

Object.assign(exports, Prisma);
