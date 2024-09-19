export interface SpreadsheetRow {
  productionCode: string;
  venueCode: string;
  bookingDate: string;
  salesDate: string;
  salesType: string;
  seats: number;
  value: string;
  isFinal: string;
  ignoreWarning: string;
  response: string;
  details: string;
  rowNumber: number;
  row: any;
}

export interface SpreadsheetData {
  venues: {
    venueCode: string;
    bookings: {
      bookingDate: Date;
      finalSalesDate: Date;
      bookingFirstRow: any;
      sales: {
        salesDate: Date;
        salesType: string;
        seats: number;
        value: string;
        isFinal: string;
        ignoreWarning: string;
        rowNumber: number;
        salesRow: any;
      }[];
    }[];
  }[];
}

export interface SpreadsheetDataCleaned {
  venues: {
    venueCode: string;
    venueId: number | null;
    bookings: {
      bookingDate: string;
      finalSalesDate: Date;
      bookingId: number | null;
      sales: {
        salesDate: string;
        isFinal: string;
        generalSales: {
          seats: number;
          value: string;
        };
        generalReservations: {
          seats: number;
          value: string;
        };
        schoolSales: {
          seats: number;
          value: string;
        };
        schoolReservations: {
          seats: number;
          value: string;
        };
      }[];
    }[];
  }[];
}

export interface SpreadsheetDataClean {
  venues: {
    venueCode: string;
    venueId: number;
    bookings: {
      bookingDate: string;
      finalSalesDate: string;
      bookingId: number;
      sales: {
        salesDate: string;
        salesType: string;
        seats: number;
        value: string;
        isFinal: string;
      }[];
    }[];
  }[];
}

export enum SalesType {
  'General Sales',
  'General Reservations',
  'School Sales',
  'School Reservations',
}

export const SalesTypeMap = {
  'General Sales': 1,
  'General Reservations': 2,
  'School Sales': 3,
  'School Reservations': 4,
};

export enum isFinalType {
  'Y',
  'y',
  'N',
  'n',
  '',
}

export enum ignoreWarningType {
  'Y',
  'y',
  '',
}

export interface SpreadsheetIssues {
  spreadsheetErrorOccurred: boolean;
  spreadsheetWarningOccurred: boolean;
  spreadsheetFormatIssue: boolean;
}

export const tableColMaps = {
  ProdCode: 1,
  VenueCode: 2,
  BookingDate: 3,
  SalesDate: 4,
  SalesType: 5,
  Seats: 6,
  Value: 7,
  isFinal: 8,
  ignoreWarning: 9,
  Response: 10,
  Details: 11,
};

export const expectedHeaders = [
  'Production Code',
  'Venue Code',
  'Booking Date',
  'Sales Date',
  'Sales Type',
  'Seats',
  'Value',
  'Is Final',
  'Ignore Warning',
  'Response',
  'Details',
];

export interface UploadParamType {
  onProgress: (file: File, uploadProgress: number) => void;
  onError: (file: File, errorMessage: string) => void;
  onUploadingImage: (file: File, imageUrl: string) => void;
  spreadsheetIssues: SpreadsheetIssues;
  spreadsheetData: SpreadsheetDataCleaned;
}
