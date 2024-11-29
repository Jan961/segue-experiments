import {
  DateBlock,
  GetInFitUp,
  Rehearsal,
  Show,
  Performance as PerformanceType,
  DateType,
  Other,
  VenueContact,
  BookingActivity,
  BookingContactNotes,
  ProductionTask,
  File,
  ConversionRate,
  Country,
  CountryInRegion,
  Region,
  GlobalBookingActivity,
} from 'prisma/generated/prisma-client';
import { Currency } from 'prisma/generated/prisma-master';
import {
  ActivityDTO,
  BookingContactNoteDTO,
  BookingDTO,
  BookingWithVenueDTO,
  DateBlockDTO,
  DateTypeDTO,
  GetInFitUpDTO,
  OtherDTO,
  PerformanceDTO,
  RehearsalDTO,
  ShowDTO,
  StatusCode,
  ProductionDTO,
  ProductionTaskDTO,
  UserDto,
  VenueContactDTO,
  VenueRoleDTO,
  ContractStatusType,
  FileDTO,
  ContractBookingStatusType,
  ConversionRateDTO,
  CurrencyDTO,
  CountryDTO,
  GlobalActivityDTO,
  DealMemoContractFormData,
} from 'interfaces';
import { ShowWithProductions } from 'services/showService';
import { ProductionWithDateblocks } from 'services/productionService';
import { BookingsWithPerformances } from 'services/bookingService';
import { dateTimeToTime, toISO } from 'services/dateService';
import { getFileUrlFromLocation } from 'utils/fileUpload';
import { UTCDate } from '@date-fns/utc';

/*

Map between Prisma and DTO. This is as the bandwidth used for the
full model is too much, and we don't want to
leak implimentation details.

An example of this, is you might want to do a vanue lookup, and only transmit needed fields to the browser.

DateTimes are converted to strings and rendered into dates at display. JS Dates do not transfer over AJAX
MySQL has different fields for Date and Time (performances), this needs to be mapped

We also have full control of types here so we can get type safety to child objects

*/

// This is so we can change the implimentation if needed. We had some issues with timezone.
export const convertDate = (date: Date) => {
  if (date) return toISO(date.getTime());
  return '';
};

const convertToString = (data: any) => {
  if (data) return data.toString();
  return '';
};

export const showMapper = (show: Show): ShowDTO => ({
  Id: show.Id,
  Name: show.Name,
  Type: show.Type,
  Code: show.Code,
  IsArchived: show.IsArchived,
});

export const showProductionMapper = (s: ShowWithProductions): ProductionDTO[] => {
  return s.Production.map(productionEditorMapper);
};

export const dateBlockMapper = (db: DateBlock): DateBlockDTO => ({
  Id: db.Id,
  StartDate: convertDate(db.StartDate),
  EndDate: convertDate(db.EndDate),
  Name: db.Name,
  IsPrimary: db.IsPrimary,
});

export const rehearsalMapper = (r: Rehearsal): RehearsalDTO => ({
  Id: r.Id,
  Date: convertDate(r.Date),
  VenueId: r.VenueId,
  Town: r.Town,
  StatusCode: r.StatusCode,
  Notes: r.Notes,
  PencilNum: r.PencilNum,
  DateType: r.DateTypeId, // Assuming the DateType ID is stored in DateTypeId
  RunTag: r.RunTag,
});

export const bookingMapper = (b: BookingsWithPerformances): BookingDTO => ({
  Date: convertDate(b.FirstDate),
  Id: b.Id,
  VenueId: b.VenueId,
  StatusCode: b.StatusCode as any,
  PencilNum: b.PencilNum,
  Notes: b.Notes,
  CastRateTicketsArranged: b.CastRateTicketsArranged,
  CastRateTicketsNotes: b.CastRateTicketsNotes,
  RunTag: b.RunTag,
  LandingPageURL: b.LandingPageURL,
  TicketsOnSale: b.TicketsOnSale,
  TicketsOnSaleFromDate: convertDate(b.TicketsOnSaleFromDate),
  MarketingPlanReceived: b.MarketingPlanReceived,
  PrintReqsReceived: b.PrintReqsReceived,
  ContactInfoReceived: b.ContactInfoReceived,
  MarketingCostsStatus: b.MarketingCostsStatus,
  MarketingCostsApprovalDate: convertDate(b.MarketingCostsApprovalDate),
  MarketingCostsNotes: b.MarketingCostsNotes,
  BookingCompNotes: b.CompNotes,
  BookingHoldNotes: b.HoldNotes,
  BookingSalesNotes: b.SalesNotes,
  PerformanceCount: b?._count?.Performance || 0,
  BookingFinalSalesDiscrepancyNotes: b.FinalSalesDiscrepancyNotes,
  BookingHasSchoolsSales: b.HasSchoolsSales,
});

export const bookingMapperWithVenue = (b: any): BookingWithVenueDTO => ({
  ...bookingMapper(b),
  Venue: {
    Id: b.Venue.Id,
    Code: b.Venue.Code,
    Name: b.Venue.Name,
    Website: b.Venue.Website,
  },
  ProductionId: b.DateBlock?.ProductionId || null,
});

export const performanceMapper = (p: PerformanceType): PerformanceDTO => {
  const day = p.Date.toISOString().split('T')[0];
  const time = p.Time?.toISOString?.()?.split?.('T')?.[1] || null;
  const Date = `${day}${time ? 'T' + time : ''}`;

  return {
    Id: p?.Id,
    Date,
    BookingId: p?.BookingId,
    Time: time,
  };
};

export const otherMapper = (o: Other): OtherDTO => ({
  Id: o.Id,
  Date: convertDate(o.Date),
  DateTypeId: o.DateTypeId,
  PencilNum: o.PencilNum,
  StatusCode: o.StatusCode as StatusCode,
  RunTag: o.RunTag,
  Notes: o.Notes,
});

export const getInFitUpMapper = (gifu: GetInFitUp): GetInFitUpDTO => ({
  Date: convertDate(gifu.Date),
  Id: gifu.Id,
  VenueId: gifu.VenueId,
  StatusCode: gifu.StatusCode as StatusCode,
  Notes: gifu.Notes,
  PencilNum: gifu.PencilNum,
  RunTag: gifu.RunTag,
});

export const FileMapper = (file: File & { ImageUrl?: string }): FileDTO => ({
  id: file.Id,
  originalFilename: file.OriginalFilename,
  mediaType: file.MediaType,
  location: file.Location,
  uploadUserId: file.UploadUserId,
  imageUrl: file?.Location ? getFileUrlFromLocation(file.Location) : null,
  uploadDateTime: file.UploadDateTime.toISOString(),
});

export const countryMapper = (
  c: Country & { CountryInRegion?: (CountryInRegion & { Region?: Region })[] },
): CountryDTO => ({
  ...c,
  RegionList: c.CountryInRegion.map((c) => c.Region) || [],
});

export const currencyMapper = (c: Currency & { Country: Country[] }): CurrencyDTO => {
  return {
    ...c,
    CurrencyCountryList: c.Country.map(countryMapper),
  };
};

export const conversionRateMapper = (
  c: ConversionRate & {
    Currency_ConversionRate_ConversionFromCurrencyCodeToCurrency?: Currency & { Country: Country[] };
    Currency_ConversionRate_ConversionToCurrencyCodeToCurrency?: Currency & { Country: Country[] };
  },
): ConversionRateDTO => ({
  ...c,
  Rate: c.Rate?.toNumber?.(),
});

export const productionEditorMapper = (t: ProductionWithDateblocks): ProductionDTO => ({
  Id: t.Id,
  ShowId: t.Show.Id,
  ShowName: t.Show.Name,
  Code: t.Code,
  ShowCode: t.Show.Code,
  DateBlock: t.DateBlock ? t.DateBlock.map(dateBlockMapper) : [],
  IsArchived: t.IsArchived,
  SalesEmail: t.SalesEmail,
  IsDeleted: t.IsDeleted,
  SalesFrequency: t.SalesFrequency,
  RunningTime: t.RunningTime ? dateTimeToTime(t.RunningTime?.toISOString?.()) : null,
  RunningTimeNote: t.RunningTimeNote,
  ReportCurrencyCode: t.ReportCurrencyCode,
  ProdCoId: t.ProdCoId,
  RegionList: t.ProductionRegion ? t.ProductionRegion.map((productionReg) => productionReg.PRRegionId) : [],
  ImageUrl: t?.File?.Location ? getFileUrlFromLocation(t.File.Location) : null,
  Image: t?.File ? FileMapper(t?.File) : null,
  ConversionRateList: t.ConversionRate?.length > 0 ? t.ConversionRate.map(conversionRateMapper) : [],
});

export const DateTypeMapper = (dt: DateType): DateTypeDTO => ({
  Id: dt.Id,
  Name: dt.Name,
  Order: dt.SeqNo,
});

export const venueContactMapper = (vc: VenueContact): VenueContactDTO => ({
  Id: vc.Id,
  FirstName: vc.FirstName,
  LastName: vc.LastName,
  Phone: vc.Phone,
  Email: vc.Email,
  VenueRoleId: vc.VenueRoleId,
});

export const activityMapper = (a: BookingActivity): ActivityDTO => ({
  Id: a.Id,
  BookingId: a.BookingId,
  Date: convertDate(a.Date),
  Name: a.Name,
  ActivityTypeId: a.ActivityTypeId,
  CompanyCost: Number(a.CompanyCost),
  VenueCost: Number(a.VenueCost),
  FollowUpRequired: a.FollowUpRequired,
  DueByDate: convertDate(a.DueByDate),
  Notes: a.Notes,
});

export const globalActivityMapper = (a: GlobalBookingActivity): GlobalActivityDTO => ({
  Id: a.Id,
  ProductionId: a.ProductionId,
  Date: convertDate(a.Date),
  Name: a.Name,
  ActivityTypeId: a.ActivityTypeId,
  Cost: Number(a.Cost),
  FollowUpRequired: a.FollowUpRequired,
  DueByDate: convertDate(a.DueByDate),
  Notes: a.Notes,
});

export const bookingContactNoteMapper = (a: BookingContactNotes): BookingContactNoteDTO => ({
  Id: a.Id,
  BookingId: a.BookingId,
  CoContactName: a.CoContactName,
  ContactDate: convertDate(a.ContactDate),
  Notes: a.Notes,
  ActionAccUserId: a.ActionAccUserId,
});

export const contractStatusmapper = (status: ContractStatusType) => {
  if (status && status.BookingId) {
    return {
      BookingId: status.BookingId ? status.BookingId : '',
      StatusCode: status.StatusCode,
      SignedDate: convertDate(status.SignedDate),
      SignedBy: status.SignedBy,
      ReturnDate: convertDate(status.ReturnDate),
      CheckedBy: status.CheckedBy,
      RoyaltyPercentage: convertToString(status.RoyaltyPercentage),
      DealType: status.DealType,
      ContractNotes: status.Notes,
      ReceivedBackDate: convertDate(status.ReceivedBackDate),
      Exceptions: status.Exceptions,
      BankDetailsSent: status.BankDetailsSent,
      TechSpecSent: status.TechSpecSent,
      PRSCertSent: status.PRSCertSent,
      GP: convertToString(status.GP),
      PromoterPercent: convertToString(status.PromoterPercent),
    };
  }
  return null;
};

export const contractBookingStatusmapper = (status: ContractBookingStatusType) => {
  return {
    DateBlockId: status.DateBlockId,
    VenueId: status.VenueId,
    FirstDate: convertDate(status.FirstDate),
    StatusCode: status.StatusCode,
    PencilNum: status.PencilNum,
    LandingPageURL: status.LandingPageURL,
    TicketsOnSaleFromDate: convertDate(status.TicketsOnSaleFromDate),
    TicketsOnSale: status.TicketsOnSale,
    MarketingPlanReceived: status.MarketingPlanReceived,
    ContactInfoReceived: status.ContactInfoReceived,
    PrintReqsReceived: status.PrintReqsReceived,
    Notes: status.Notes,
    DealNotes: status.DealNotes,
    TicketPriceNotes: status.TicketPriceNotes,
    MarketingDealNotes: status.MarketingDealNotes,
    CrewNotes: status.CrewNotes,
    SalesNotes: status.SalesNotes,
    HoldNotes: status.HoldNotes,
    CompNotes: status.CompNotes,
    MerchandiseNotes: status.MerchandiseNotes,
    CastRateTicketsNotes: status.CastRateTicketsNotes,
    CastRateTicketsArranged: status.CastRateTicketsArranged,
    RunTag: status.RunTag,
    MarketingCostsStatus: status.MarketingCostsStatus,
    MarketingCostsApprovalDate: convertDate(status.MarketingCostsApprovalDate),
    MarketingCostsNotes: status.MarketingCostsNotes,
  };
};

export const dealMemoMapper = (dealMemo: DealMemoContractFormData) => {
  return {
    Id: dealMemo.Id,
    BookingId: dealMemo.BookingId,
    AccContId: dealMemo.AccContId,
    RunningTime: convertDate(dealMemo.RunningTime),
    DateIssued: convertDate(dealMemo.DateIssued),
    VatCode: dealMemo.VatCode,
    RunningTimeNotes: dealMemo.RunningTimeNotes,
    PrePostShowEvents: dealMemo.PrePostShowEvents,
    DressingRooms: dealMemo.DressingRooms,
    VenueCurfewTime: convertDate(dealMemo.VenueCurfewTime),
    PerformanceNotes: dealMemo.PerformanceNotes,
    ProgrammerVenueContactId: dealMemo.ProgrammerVenueContactId,
    ROTTPercentage: dealMemo.ROTTPercentage,
    PRSPercentage: dealMemo.PRSPercentage,
    Guarantee: dealMemo.Guarantee,
    GuaranteeAmount: dealMemo.GuaranteeAmount,
    HasCalls: dealMemo.HasCalls,
    PromoterSplitPercentage: dealMemo.PromoterSplitPercentage,
    VenueSplitPercentage: dealMemo.VenueSplitPercentage,
    VenueRental: dealMemo.VenueRental,
    VenueRentalNotes: dealMemo.VenueRentalNotes,
    StaffingContra: dealMemo.StaffingContra,
    StaffingContraNotes: dealMemo.StaffingContraNotes,
    AgreedContraItems: dealMemo.AgreedContraItems,
    AgreedContraItemsNotes: dealMemo.AgreedContraItemsNotes,
    BOMVenueContactId: dealMemo.BOMVenueContactId,
    OnSaleDate: convertDate(dealMemo.OnSaleDate),
    SettlementVenueContactId: dealMemo.SettlementVenueContactId,
    SellableSeats: dealMemo.SellableSeats,
    MixerDeskPosition: dealMemo.MixerDeskPosition,
    RestorationLevy: dealMemo.RestorationLevy,
    BookingFees: dealMemo.BookingFees,
    CCCommissionPercent: dealMemo.CCCommissionPercent,
    TxnChargeOption: dealMemo.TxnChargeOption,
    TxnChargeAmount: dealMemo.TxnChargeAmount,
    AgreedDiscounts: dealMemo.AgreedDiscounts,
    MaxTAAlloc: dealMemo.MaxTAAlloc,
    TAAlloc: dealMemo.TAAlloc,
    TicketCopy: dealMemo.TicketCopy,
    ProducerCompCount: dealMemo.ProducerCompCount,
    OtherHolds: dealMemo.OtherHolds,
    AgeNotes: dealMemo.AgeNotes,
    SalesDayNum: dealMemo.SalesDayNum,
    MMVenueContactId: dealMemo.MMVenueContactId,
    BrochureDeadline: convertDate(dealMemo.BrochureDeadline),
    FinalProofBy: convertDate(dealMemo.FinalProofBy),
    PrintReqs: dealMemo.PrintReqs,
    LocalMarketingBudget: dealMemo.LocalMarketingBudget,
    LocalMarketingContra: dealMemo.LocalMarketingContra,
    SellWho: dealMemo.SellWho,
    SellProgrammes: dealMemo.SellProgrammes,
    PrintDelUseVenueAddress: dealMemo.PrintDelUseVenueAddress,
    PrintDelVenueAddressline: dealMemo.PrintDelVenueAddressLine,
    SellMerch: dealMemo.SellMerch,
    MerchNotes: dealMemo.MerchNotes,
    SellProgCommPercent: dealMemo.SellProgCommPercent,
    SellMerchCommPercent: dealMemo.SellMerchCommPercent,
    SellPitchFee: dealMemo.SellPitchFee,
    TechVenueContactId: dealMemo.TechVenueContactId,
    TechArrivalDate: convertDate(dealMemo.TechArrivalDate),
    TechArrivalTime: convertDate(dealMemo.TechArrivalTime),
    NumFacilitiesLaundry: dealMemo.NumFacilitiesLaundry,
    NumFacilitiesDrier: dealMemo.NumFacilitiesDrier,
    NumFacilitiesLaundryRoom: dealMemo.NumFacilitiesLaundryRoom,
    NumFacilitiesNotes: dealMemo.NumFacilitiesNotes,
    NumCateringNotes: dealMemo.NumCateringNotes,
    BarringClause: dealMemo.BarringClause,
    AdvancePaymentRequired: dealMemo.AdvancePaymentRequired,
    AdvancePaymentAmount: dealMemo.AdvancePaymentAmount,
    AdvancePaymentDueBy: convertDate(dealMemo.AdvancePaymentDueBy),
    SettlementDays: dealMemo.SettlementDays,
    ContractClause: dealMemo.ContractClause,
    DealMemoPrice: dealMemo.DealMemoPrice,
    DealMemoTechProvision: dealMemo.DealMemoTechProvision,
    DealMemoCall: dealMemo.DealMemoCall,
    DealMemoHold: dealMemo.DealMemoHold,
    Status: dealMemo.Status,
    CompletedBy: dealMemo.CompletedBy,
    ApprovedBy: dealMemo.ApprovedBy,
    DateReturned: convertDate(dealMemo.DateReturned),
    Notes: dealMemo.Notes,
    CompAccContId: dealMemo.CompAccContId,
    SendTo: dealMemo.SendTo,
    SettlementSameDay: dealMemo.SettlementSameDay,
    SeatKillNotes: dealMemo.SeatKillNotes,
  };
};

export const mapToProductionTaskDTO = (t: ProductionTask): ProductionTaskDTO => {
  return {
    ...t,
    TaskCompletedDate: new UTCDate(t.TaskCompletedDate),
  };
};

export const venueRoleMapper = (vr: any): VenueRoleDTO => ({
  Id: vr.Id,
  Name: vr.Name,
  Standard: vr.IsStandard,
});

export const userMapper = (user): UserDto => ({
  Id: user.UserId,
  FirstName: user.UserFirstName,
  LastName: user.UserLastName,
  Email: user.UserEmail,
  AccUserId: user.AccountUser[0].AccUserId,
});
