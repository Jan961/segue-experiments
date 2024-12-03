import Decimal from 'decimal.js';

export enum BOOK_STATUS_CODES {
  C = 'C',
  X = 'X',
  S = 'S',
}

export enum VENUE_CURRENCY_SYMBOLS {
  POUND = '£',
  EURO = '€',
  USD = '$',
}

export enum SALES_TYPE_NAME {
  GENERAL_SALES = 'General Sales',
  GENERAL_RESERVATION = 'General Reservations',
}

export type TSalesView = {
  ShowName: string;
  BookingId: string;
  ProductionId: number;
  FullProductionCode: string;
  ProductionStartDate: string;
  ProductionEndDate: string;
  BookingFirstDate: string;
  BookingStatusCode: BOOK_STATUS_CODES;
  BookingProductionWeekNum: number;
  VenueTown: string;
  VenueCode: string;
  VenueName: string;
  VenueCurrencyCode: string; // GBP
  VenueCurrencySymbol: VENUE_CURRENCY_SYMBOLS;
  ConversionToCurrencyCode: string; // GBP,
  ConversionRate: number;
  SetSalesFiguresDate: string;
  SetBookingWeekNum: number;
  SetProductionWeekNum: number;
  SetProductionWeekDate: string;
  SetNotOnSale: string;
  SetIsFinalFigures: string;
  SetSingleSeats: string;
  SetBrochureReleased: string;
  SetIsCopy: string;
  SaleTypeName: SALES_TYPE_NAME | null;
  Seats: Decimal;
  Value: Decimal;
  TotalCapacity: number;
  FinalFiguresDate: string;
  FinalFiguresSeats: number;
  FinalFiguresValue: Decimal;
  NotOnSalesDate: string;
};

export type TRequiredFields = {
  BookingFirstDate: TSalesView['BookingFirstDate'];
  VenueTown: TSalesView['VenueTown'];
  VenueName: TSalesView['VenueName'];
  Value: number;
  BookingProductionWeekNum: TSalesView['BookingProductionWeekNum'];
  VenueCurrencySymbol: TSalesView['VenueCurrencySymbol'];
  SetBookingWeekNum: TSalesView['SetBookingWeekNum'];
  SetProductionWeekDate: TSalesView['SetProductionWeekDate'];
  ConversionRate: TSalesView['ConversionRate'];
  SetIsCopy: TSalesView['SetIsCopy'];
  SetBrochureReleased: TSalesView['SetBrochureReleased'];
  BookingStatusCode: TSalesView['BookingStatusCode'];
  FinalFiguresValue: number;
  TotalCapacity: TSalesView['TotalCapacity'];
  Seats: number;
  NotOnSalesDate: TSalesView['NotOnSalesDate'];
  SetProductionWeekNum: TSalesView['SetProductionWeekNum'];
  BookingId: TSalesView['BookingId'];
};

export type TRequiredFieldsFinalFormat = TRequiredFields & {
  Week: string;
  Day: string;
  Date: TSalesView['BookingFirstDate'];
  Town: TSalesView['VenueTown'];
  Venue: TSalesView['VenueName'];
  FormattedValue: string;
  FormattedFinalFiguresValue: number;
  FormattedSetProductionWeekNum: string;
  Value: number;
};

export type UniqueHeadersObject = {
  FormattedSetProductionWeekNum: string;
  SetProductionWeekDate: string;
};

export type TGroupBasedOnWeeksKeepingVenueCommon = {
  Week: TRequiredFieldsFinalFormat['Week'];
  Day: TRequiredFieldsFinalFormat['Day'];
  Date: TRequiredFieldsFinalFormat['Date'];
  Town: TRequiredFieldsFinalFormat['Town'];
  Venue: TRequiredFieldsFinalFormat['Venue'];
  BookingStatusCode: TRequiredFieldsFinalFormat['BookingStatusCode']; // NOTE - It will be same for the Venue's all weeks
  FormattedFinalFiguresValue: TRequiredFieldsFinalFormat['FormattedFinalFiguresValue'];
  VenueCurrencySymbol: TRequiredFieldsFinalFormat['VenueCurrencySymbol'];
  ConversionRate: TRequiredFieldsFinalFormat['ConversionRate']; // This we need to handle the scenario of totals
  NotOnSalesDate: TRequiredFieldsFinalFormat['NotOnSalesDate'];
  data: {
    Value: TRequiredFieldsFinalFormat['Value'];
    FormattedValue: TRequiredFieldsFinalFormat['FormattedValue'];
    ConversionRate: TRequiredFieldsFinalFormat['ConversionRate'];
    VenueCurrencySymbol: TRequiredFieldsFinalFormat['VenueCurrencySymbol'];
    FormattedSetProductionWeekNum: TRequiredFieldsFinalFormat['FormattedSetProductionWeekNum'];
    SetProductionWeekDate: TRequiredFieldsFinalFormat['SetProductionWeekDate'];
    SetIsCopy: TRequiredFieldsFinalFormat['SetIsCopy'];
    SetBrochureReleased: TRequiredFieldsFinalFormat['SetBrochureReleased'];
  }[];
};

export type TKeyAndGroupBasedOnWeeksKeepingVenueCommonMapping = {
  [key: string]: TGroupBasedOnWeeksKeepingVenueCommon;
};

export type TotalForSheet = {
  Value: TRequiredFieldsFinalFormat['Value'];
  ConversionRate: TRequiredFieldsFinalFormat['ConversionRate'];
  VenueCurrencySymbol: TRequiredFieldsFinalFormat['VenueCurrencySymbol'];
  ConvertedValue: number;
};

export type WeekAggregates = {
  [key: string]: TotalForSheet[];
};

export type WeekAggregateSeatsDetailCurrencyWise = {
  Seats: number;
  TotalCapacity: number;
  VenueCurrencySymbol: TRequiredFieldsFinalFormat['VenueCurrencySymbol'];
};

// Key is currency symbol
export type WeekAggregateSeatsDetail = {
  [key: string]: WeekAggregateSeatsDetailCurrencyWise[];
};
