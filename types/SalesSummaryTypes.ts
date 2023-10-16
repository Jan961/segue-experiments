import Decimal from "decimal.js"

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
    SetBookingWeekNum: number
    SetTourWeekNum: number
    SetTourWeekDate: string
    SetNotOnSale: string
    SetIsFinalFigures: string
    SetSingleSeats: string
    SetBrochureReleased: string
    SetIsCopy: string
    SaleTypeName: SALES_TYPE_NAME | null
    Seats: Decimal
    Value: Decimal
    TotalCapacity: number
    FinalFiguresDate: string
    FinalFiguresSeats: number
    FinalFiguresValue: Decimal
    NotOnSalesDate: string
  }

export type TRequiredFields = {
    BookingFirstDate: TSalesView['BookingFirstDate']
    VenueTown: TSalesView['VenueTown']
    VenueName: TSalesView['VenueName']
    Value: number
    BookingTourWeekNum: TSalesView['BookingTourWeekNum']
    VenueCurrencySymbol: TSalesView['VenueCurrencySymbol']
    SetBookingWeekNum: TSalesView['SetBookingWeekNum']
    SetTourWeekDate: TSalesView['SetTourWeekDate']
    ConversionRate: TSalesView['ConversionRate']
    SetIsCopy: TSalesView['SetIsCopy']
    SetBrochureReleased: TSalesView['SetBrochureReleased']
    BookingStatusCode: TSalesView['BookingStatusCode']
    FinalFiguresValue: number
    TotalCapacity: TSalesView['TotalCapacity']
    Seats: number
    NotOnSalesDate: TSalesView['NotOnSalesDate']
    SetTourWeekNum: TSalesView['SetTourWeekNum']
  }

export type TRequiredFieldsFinalFormat = TRequiredFields & {
    Week: string
    Day: string
    Date: TSalesView['BookingFirstDate']
    Town: TSalesView['VenueTown']
    Venue: TSalesView['VenueName']
    FormattedValue: string
    FormattedFinalFiguresValue: number
    FormattedSetTourWeekNum: string
    Value: number
  }

export type UniqueHeadersObject = {
    FormattedSetTourWeekNum: string
    SetTourWeekDate: string
  }

export type TGroupBasedOnWeeksKeepingVenueCommon = {
    Week: TRequiredFieldsFinalFormat['Week']
    Day: TRequiredFieldsFinalFormat['Day']
    Date: TRequiredFieldsFinalFormat['Date']
    Town: TRequiredFieldsFinalFormat['Town']
    Venue: TRequiredFieldsFinalFormat['Venue']
    BookingStatusCode: TRequiredFieldsFinalFormat['BookingStatusCode'] // NOTE - It will be same for the Venue's all weeks
    FormattedFinalFiguresValue: TRequiredFieldsFinalFormat['FormattedFinalFiguresValue']
    VenueCurrencySymbol: TRequiredFieldsFinalFormat['VenueCurrencySymbol']
    ConversionRate: TRequiredFieldsFinalFormat['ConversionRate'] // This we need to handle the scenario of totals
    NotOnSalesDate: TRequiredFieldsFinalFormat['NotOnSalesDate']
    data: {
      Value: TRequiredFieldsFinalFormat['Value']
      FormattedValue: TRequiredFieldsFinalFormat['FormattedValue']
      ConversionRate: TRequiredFieldsFinalFormat['ConversionRate']
      VenueCurrencySymbol: TRequiredFieldsFinalFormat['VenueCurrencySymbol']
      FormattedSetTourWeekNum: TRequiredFieldsFinalFormat['FormattedSetTourWeekNum']
      SetTourWeekDate: TRequiredFieldsFinalFormat['SetTourWeekDate']
      SetIsCopy: TRequiredFieldsFinalFormat['SetIsCopy']
      SetBrochureReleased: TRequiredFieldsFinalFormat['SetBrochureReleased']
    }[]
  }

export type TKeyAndGroupBasedOnWeeksKeepingVenueCommonMapping = {
    [key: string]: TGroupBasedOnWeeksKeepingVenueCommon
  }

export type TotalForSheet = {
    Value: TRequiredFieldsFinalFormat['Value']
    ConversionRate: TRequiredFieldsFinalFormat['ConversionRate']
    VenueCurrencySymbol: TRequiredFieldsFinalFormat['VenueCurrencySymbol']
    ConvertedValue: number
  }

export type WeekAggregates = {
  [key: string]: TotalForSheet[]
}

export type WeekAggregateSeatsDetailCurrencyWise = {
    Seats: number
    TotalCapacity: number
    VenueCurrencySymbol: TRequiredFieldsFinalFormat['VenueCurrencySymbol']
  }

// Key is currency symbol
export type WeekAggregateSeatsDetail = {
    [key: string] : WeekAggregateSeatsDetailCurrencyWise[]
  }
