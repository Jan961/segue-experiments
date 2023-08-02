export enum BOOK_STATUS_CODES {
    C = 'C',
    X = 'X'
  }

export enum VENUE_CURRENCY_SYMBOLS {
    POUND = '£',
    EURO = '€'
  }

export enum SALES_TYPE_NAME {
    GENERAL_SALES = 'General Sales',
    GENERAL_RESERVATION = 'General Reservations'
  }

export type TSalesView = {
    ShowName: string
    TourId: number
    FullTourCode: string
    TourStartDate: string
    TourEndDate: string
    BookingId: number
    BookingFirstDate: string
    BookingStatusCode: BOOK_STATUS_CODES
    BookingTourWeekNum: number
    VenueTown: string
    VenueCode: string
    VenueName: string
    VenueCurrencyCode: string // GBP
    VenueCurrencySymbol: VENUE_CURRENCY_SYMBOLS
    ConversionToCurrencyCode: string // GBP,
    ConversionRate: number
    SetSalesFiguresDate: string
    SetTourWeekNum: number
    SetTourWeekDate: string
    SetNotOnSale: string
    SetIsFinalFigures: string
    SetSingleSeats: string
    SetBrochureReleased: string
    SetIsCopy: string
    SaleTypeName: SALES_TYPE_NAME | null
    Seats: number
    Value: number
    TotalCapacity: number
    FinalFiguresDate: string
    FinalFiguresSeats: number
    FinalFiguresValue: number
    NotOnSalesDate: string
  }

export type SeatsInfo = {
    Seats: number | null,
    ValueWithCurrencySymbol: string,
    BookingId: number,
    DataFound: boolean
  }
