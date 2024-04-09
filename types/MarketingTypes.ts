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
  seatsSold: number;
  seatsSaleChange: number;
  reservations: number;
  reserved: string;
  venueCurrencySymbol: string;
  totalValue: number;
  valueChange: number;
  totalHolds: string;
  seatsChange: number;
  isCopy: boolean;
  isBrochureReleased: boolean;
  isSingleSeats: boolean;
  isNotOnSale: boolean;
  capacity: number;
  isFinal: boolean;
  notOnSaleDate: string;
};

export type BookingSelection = {
  BookingId: number;
  BookingStatusCode: string;
  BookingFirstDate: string;
  VenueId: number;
  VenueCode: string;
  VenueMainAddressTown: string;
  ProductionId: number;
  FullProductionCode: string;
  ProductionLengthWeeks: number;
  PerformanceCount: number;
};
