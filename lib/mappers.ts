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
  User,
  File,
  ConversionRate,
  Currency,
  Country,
  CountryInRegion,
  Region,
  GlobalBookingActivity,
} from '@prisma/client';
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
} from 'interfaces';
import { ShowWithProductions } from 'services/ShowService';
import { ProductionWithDateblocks } from 'services/productionService';
import { BookingsWithPerformances } from 'services/bookingService';
import { dateTimeToTime, toISO } from 'services/dateService';
import { getFileUrlFromLocation } from 'utils/fileUpload';

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
  if (date) return toISO(date);
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
  // console.table(s.Production);
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

export const currencyMapper = (c: Currency & { Country: Country[] }): CurrencyDTO => ({
  ...c,
  CountryList: c.Country.map(countryMapper),
});

export const conversionRateMapper = (
  c: ConversionRate & {
    Currency_ConversionRate_ConversionFromCurrencyCodeToCurrency?: Currency & { Country: Country[] };
    Currency_ConversionRate_ConversionToCurrencyCodeToCurrency?: Currency & { Country: Country[] };
  },
): ConversionRateDTO => ({
  ...c,
  Rate: c.Rate?.toNumber?.(),
  FromCurrency: currencyMapper(c.Currency_ConversionRate_ConversionFromCurrencyCodeToCurrency),
  ToCurrency: currencyMapper(c.Currency_ConversionRate_ConversionToCurrencyCodeToCurrency),
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
  ConversionRateList: t?.ConversionRate?.map(conversionRateMapper) || [],
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
  UserId: a.UserId,
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

export const mapToProductionTaskDTO = (t: ProductionTask): ProductionTaskDTO => {
  return {
    ...t,
  };
};

export const venueRoleMapper = (vr: any): VenueRoleDTO => ({
  Id: vr.Id,
  Name: vr.Name,
  Standard: vr.IsStandard,
});

export const userMapper = (user: User): UserDto => ({
  Id: user.Id,
  FirstName: user.FirstName,
  LastName: user.LastName,
  Email: user.Email,
});
