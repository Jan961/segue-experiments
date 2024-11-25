import { UTCDate } from '@date-fns/utc';

export enum BOOK_STATUS_CODES {
  C = 'C',
  X = 'X',
}

export enum VENUE_CURRENCY_SYMBOLS {
  POUND = '£',
  EURO = '€',
}

export enum SALES_TYPE_NAME {
  GENERAL_SALES = 'General Sales',
  GENERAL_RESERVATION = 'General Reservations',
  SCHOOL_SALES = 'School Sales',
  SCHOOL_RESERVATION = 'School Reservations',
}

export type TSalesView = {
  ShowName: string;
  ProductionId: number;
  FullProductionCode: string;
  ProductionStartDate: string;
  ProductionEndDate: string;
  BookingId: number;
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
  SetProductionWeekDate: string;
  SetNotOnSale: string;
  SetIsFinalFigures: string;
  SetSingleSeats: string;
  SetBrochureReleased: string;
  SetIsCopy: string;
  SaleTypeName: SALES_TYPE_NAME | null;
  Seats: number;
  Value: number;
  TotalCapacity: number;
  FinalFiguresDate: string;
  FinalFiguresSeats: number;
  FinalFiguresValue: number;
  NotOnSalesDate: string;
};

export type SeatsInfo = {
  Seats: number | null;
  ValueWithCurrencySymbol: string;
  BookingId: number;
  DataFound: boolean;
  SetSalesFiguresDate: string;
  Value: number;
  currencySymbol: string;
};

export type SalesComparison = {
  SetBookingWeekNum: number;
  SetIsFinalFigures: boolean;
  SetProductionWeekDate: string;
  data: Array<SeatsInfo>;
};

export type SalesSnapshot = {
  week: string;
  weekOf: string;
  schSeatsSold: string;
  genSeatsSold: string;
  seatsSaleChange: string;
  schReservations: string;
  schReserved: string;
  genReservations: string;
  genReserved: string;
  venueCurrencySymbol: string;
  schTotalValue: string;
  genTotalValue: string;
  valueChange: string;
  totalHolds: string;
  seatsChange: string;
  isCopy: boolean;
  isBrochureReleased: boolean;
  isSingleSeats: boolean;
  isNotOnSale: boolean;
  capacity: string;
  isFinal: boolean;
  notOnSaleDate: string;
};

export type BookingSelection = {
  BookingId: number;
  BookingStatusCode: string;
  BookingFirstDate: UTCDate;
  VenueId: number;
  VenueCode: string;
  VenueMainAddressTown: string;
  ProductionId: number;
  FullProductionCode: string;
  ProductionLengthWeeks: number;
  PerformanceCount?: number;
  HasSalesData?: boolean;
};

export type SalesTabs =
  | 'sales'
  | 'archived sales'
  | 'activities'
  | 'contact notes'
  | 'venue contacts'
  | 'promoter holds'
  | 'attachments'
  | '';

export type LastPerfDate = {
  BookingId: number;
  LastPerformanaceDate: string;
};
